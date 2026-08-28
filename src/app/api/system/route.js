import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const iso = (value) => value ? new Date(value).toISOString() : "";
const dateLabel = (value) => value ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)) : "";
const timeLabel = (value) => value ? new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(new Date(value)) : "";
const routeLabel = (route) => route ? `${route.origin} to ${route.destination}` : "Unknown route";
const fullName = (profile) => profile ? [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(" ") : "Unknown";

async function loadState(supabase) {
  const [routesQ,busesQ,tripsQ,ticketsQ,paymentsQ,manifestQ,reportsQ,feedbackQ,logsQ,usersQ] = await Promise.all([
    supabase.from("routes").select("*").order("created_at"),
    supabase.from("buses").select("*,routes(*),conductor:profiles!conductor_id(*)").order("created_at"),
    supabase.from("trips").select("*,routes(*),buses(*),conductor:profiles!conductor_id(*)").order("departure_at"),
    supabase.from("tickets").select("*,routes(*),buses(*),passenger:profiles!passenger_id(*),validator:profiles!validated_by(*)").order("purchased_at", { ascending: false }),
    supabase.from("payments").select("*,tickets(*,routes(*)),passenger:profiles!passenger_id(*)").order("paid_at", { ascending: false }),
    supabase.from("manifest_passengers").select("*,tickets(*,routes(*)),trips(*)").order("created_at", { ascending: false }),
    supabase.from("incident_reports").select("*,conductor:profiles!conductor_id(*),trips(*)").order("submitted_at", { ascending: false }),
    supabase.from("feedback").select("*,passenger:profiles!passenger_id(*),routes(*)").order("created_at", { ascending: false }),
    supabase.from("validation_logs").select("*,tickets(*,routes(*)),conductor:profiles!conductor_id(*),buses(*)").order("scanned_at", { ascending: false }),
    supabase.from("profiles").select("*").order("created_at"),
  ]);
  const queries = [routesQ,busesQ,tripsQ,ticketsQ,paymentsQ,manifestQ,reportsQ,feedbackQ,logsQ,usersQ];
  const failure = queries.find((query) => query.error);
  if (failure?.error) throw failure.error;

  const tickets = (ticketsQ.data ?? []).map((t) => ({
    id:t.id, reference:t.reference, passengerId:t.passenger_id, passengerName:t.passenger_name,
    passengerPhone:t.passenger_phone ?? undefined, routeId:t.route_id, route:routeLabel(t.routes),
    origin:t.routes?.origin, destination:t.routes?.destination, departureTime:t.routes?.departure_time ?? "",
    travelDate:t.travel_date, fare:Number(t.fare), seatNumber:t.seat_number,
    busNumber:t.bus_id ?? undefined, status:t.status, purchasedAt:iso(t.purchased_at),
    validatedAt:t.validated_at ? iso(t.validated_at) : undefined,
    validatedBy:t.validator ? fullName(t.validator) : undefined, paymentMethod:t.payment_method,
  }));
  const bookedByTrip = new Map();
  ticketsQ.data?.forEach((ticket) => ticket.trip_id && bookedByTrip.set(ticket.trip_id, (bookedByTrip.get(ticket.trip_id) ?? 0) + (ticket.status !== "cancelled" ? 1 : 0)));
  const boardedByTrip = new Map();
  manifestQ.data?.forEach((entry) => entry.trip_id && boardedByTrip.set(entry.trip_id, (boardedByTrip.get(entry.trip_id) ?? 0) + (entry.is_boarded ? 1 : 0)));

  return {
    routes:(routesQ.data ?? []).map((r) => ({ id:r.id,origin:r.origin,destination:r.destination,departureTime:r.departure_time,duration:r.duration,distanceKm:r.distance_km == null ? undefined : Number(r.distance_km),fare:Number(r.fare),status:r.status,stops:r.stops,operatingDays:r.operating_days ?? undefined,busAssigned:(busesQ.data ?? []).find((b) => b.route_id===r.id)?.id })),
    buses:(busesQ.data ?? []).map((b) => ({ id:b.id,plate:b.plate,model:b.model,capacity:b.capacity,routeId:b.route_id ?? "",routeName:routeLabel(b.routes),conductorId:b.conductor_id ?? undefined,conductorName:b.conductor ? fullName(b.conductor) : undefined,status:b.status,amenities:b.amenities })),
    tickets,
    payments:(paymentsQ.data ?? []).map((p) => ({ id:p.id,ticketReference:p.tickets?.reference ?? "",passengerName:fullName(p.passenger),passengerEmail:p.passenger?.email,route:routeLabel(p.tickets?.routes),amount:Number(p.amount),method:p.method,status:p.status,date:iso(p.paid_at),transactionRef:p.transaction_ref })),
    trips:(tripsQ.data ?? []).map((t) => ({ id:t.id,tripNumber:t.trip_number,bus:t.bus_id,route:routeLabel(t.routes),routeId:t.route_id,departureTime:timeLabel(t.departure_at),estimatedArrival:timeLabel(t.estimated_arrival_at),status:t.status,totalSeats:t.buses?.capacity ?? 0,bookedSeats:bookedByTrip.get(t.id) ?? 0,boardedCount:boardedByTrip.get(t.id) ?? 0,currentStopIndex:t.current_stop_index,stops:t.routes?.stops ?? [] })),
    manifestPassengers:(manifestQ.data ?? []).map((m) => ({ id:m.id,name:m.tickets?.passenger_name ?? "Unknown",phone:m.tickets?.passenger_phone ?? "",ticketReference:m.tickets?.reference ?? "",seatNumber:m.tickets?.seat_number ?? "",destination:m.tickets?.routes?.destination ?? "",isBoarded:m.is_boarded,specialAssistance:m.special_assistance || undefined })),
    incidentReports:(reportsQ.data ?? []).map((r) => ({ id:r.id,tripId:r.trip_id,conductorName:fullName(r.conductor),type:r.type,severity:r.severity,title:r.title,description:r.description,status:r.status,submittedAt:iso(r.submitted_at) })),
    feedbackList:(feedbackQ.data ?? []).map((f) => ({ id:f.id,passengerName:fullName(f.passenger),passengerEmail:f.passenger?.email ?? "",route:routeLabel(f.routes),rating:f.rating,category:f.category,comment:f.comment,date:dateLabel(f.created_at),status:f.status })),
    validationLogs:(logsQ.data ?? []).map((l) => ({ id:l.id,ticketReference:l.ticket_reference,passengerName:l.tickets?.passenger_name ?? "Unknown",route:routeLabel(l.tickets?.routes),status:l.status,timestamp:iso(l.scanned_at),conductorName:fullName(l.conductor),bus:l.bus_id ?? "" })),
    users:(usersQ.data ?? []).map((u) => ({ id:u.id,firstName:u.first_name,middleName:u.middle_name ?? undefined,lastName:u.last_name,name:fullName(u),email:u.email,phone:u.phone ?? undefined,nationalId:u.national_id ?? undefined,role:u.role,accountStatus:u.account_status,avatarUrl:u.avatar_url ?? undefined,emergencyContact:u.emergency_contact ?? undefined,preferredCurrency:u.preferred_currency })),
  };
}

async function authenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return { error: NextResponse.json({ message:"Unauthorized." }, { status:401 }) };
  const {data:profile}=await supabase.from("profiles").select("account_status").eq("id",data.claims.sub).single();
  if(profile?.account_status==="Suspended") return {error:NextResponse.json({message:"Account suspended."},{status:403})};
  return { supabase, userId:data.claims.sub };
}

async function loadPublicState(supabase) {
  const [routesQ,busesQ,tripsQ] = await Promise.all([
    supabase.from("routes").select("*").order("created_at"),
    supabase.from("buses").select("*,routes(*)").order("created_at"),
    supabase.from("trips").select("*,routes(*),buses(*)").order("departure_at"),
  ]);
  const failure=[routesQ,busesQ,tripsQ].find((q)=>q.error); if(failure?.error) throw failure.error;
  return { ...{
    routes:(routesQ.data??[]).map((r)=>({id:r.id,origin:r.origin,destination:r.destination,departureTime:r.departure_time,duration:r.duration,distanceKm:r.distance_km==null?undefined:Number(r.distance_km),fare:Number(r.fare),status:r.status,stops:r.stops,operatingDays:r.operating_days??undefined,busAssigned:(busesQ.data??[]).find((b)=>b.route_id===r.id)?.id})),
    buses:(busesQ.data??[]).map((b)=>({id:b.id,plate:b.plate,model:b.model,capacity:b.capacity,routeId:b.route_id??"",routeName:routeLabel(b.routes),status:b.status,amenities:b.amenities})),
    trips:(tripsQ.data??[]).map((t)=>({id:t.id,tripNumber:t.trip_number,bus:t.bus_id,route:routeLabel(t.routes),routeId:t.route_id,departureTime:timeLabel(t.departure_at),estimatedArrival:timeLabel(t.estimated_arrival_at),status:t.status,totalSeats:t.buses?.capacity??0,bookedSeats:0,boardedCount:0,currentStopIndex:t.current_stop_index,stops:t.routes?.stops??[]})),
  }, tickets:[],payments:[],manifestPassengers:[],incidentReports:[],feedbackList:[],validationLogs:[],users:[] };
}

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if(data?.claims?.sub){const auth=await authenticatedClient();if(auth.error)return auth.error;try{return NextResponse.json({state:await loadState(auth.supabase)});}catch(error){return NextResponse.json({message:error.message??"Unable to load system data."},{status:500});}}
  try { return NextResponse.json({ state:await loadPublicState(supabase) }); }
  catch (error) { return NextResponse.json({ message:error.message ?? "Unable to load system data." }, { status:500 }); }
}

export async function POST(request) {
  const auth = await authenticatedClient();
  if (auth.error) return auth.error;
  const { supabase, userId } = auth;
  const body = await request.json().catch(() => ({}));
  const input = body.input ?? {};
  let query;
  switch (body.action) {
    case "bookTicket": query = await supabase.rpc("book_ticket", { p_route_id:input.routeId,p_travel_date:input.travelDate,p_seat_number:input.seatNumber,p_passenger_name:input.passengerName,p_passenger_phone:input.passengerPhone,p_payment_method:input.paymentMethod }); break;
    case "validateTicket": query = await supabase.rpc("validate_ticket", { p_reference:input.reference,p_bus_id:input.bus ?? null }); break;
    case "cancelTicket": query = await supabase.rpc("cancel_ticket", { p_ticket_id:input.ticketId }); break;
    case "addRoute": query = await supabase.from("routes").insert({ origin:input.origin,destination:input.destination,departure_time:input.departureTime,duration:input.duration,distance_km:input.distanceKm,fare:input.fare,status:input.status,stops:input.stops,operating_days:input.operatingDays }).select().single(); break;
    case "updateRoute": query = await supabase.from("routes").update({ origin:input.updates.origin,destination:input.updates.destination,departure_time:input.updates.departureTime,duration:input.updates.duration,distance_km:input.updates.distanceKm,fare:input.updates.fare,status:input.updates.status,stops:input.updates.stops,operating_days:input.updates.operatingDays }).eq("id",input.id).select().single(); break;
    case "deleteRoute": query = await supabase.from("routes").delete().eq("id",input.id); break;
    case "addBus": query = await supabase.from("buses").insert({ id:`BUS-${crypto.randomUUID().slice(0,8).toUpperCase()}`,plate:input.plate,model:input.model,capacity:input.capacity,route_id:input.routeId || null,conductor_id:input.conductorId || null,status:input.status,amenities:input.amenities }).select().single(); break;
    case "updateBus": query = await supabase.from("buses").update({ plate:input.updates.plate,model:input.updates.model,capacity:input.updates.capacity,route_id:input.updates.routeId || null,conductor_id:input.updates.conductorId || null,status:input.updates.status,amenities:input.updates.amenities }).eq("id",input.id).select().single(); break;
    case "deleteBus": query = await supabase.from("buses").delete().eq("id",input.id); break;
    case "updateTripStatus": query = await supabase.from("trips").update({ status:input.status,...(input.currentStopIndex === undefined ? {} : { current_stop_index:input.currentStopIndex }) }).eq("id",input.tripId).select().single(); break;
    case "toggleManifestBoarded": query = await supabase.from("manifest_passengers").update({ is_boarded:input.isBoarded,boarded_at:input.isBoarded ? new Date().toISOString() : null }).eq("id",input.manifestId).select().single(); break;
    case "submitIncidentReport": query = await supabase.from("incident_reports").insert({ trip_id:input.tripId,conductor_id:userId,type:input.type,severity:input.severity,title:input.title,description:input.description }).select().single(); break;
    case "submitFeedback": {
      const routeName=String(input.route??""); const origin=routeName.split(" to ")[0]??"";
      let route = await supabase.from("routes").select("id").eq("id",routeName).maybeSingle();
      if(!route.data && origin) route=await supabase.from("routes").select("id").eq("origin",origin).limit(1).maybeSingle();
      query = await supabase.from("feedback").insert({ passenger_id:userId,route_id:route.data?.id ?? null,rating:input.rating,category:input.category,comment:input.comment }).select().single(); break;
    }
    default: return NextResponse.json({ message:"Unknown system action." }, { status:400 });
  }
  if (query.error) return NextResponse.json({ message:query.error.message }, { status:400 });
  try { return NextResponse.json({ result:query.data,state:await loadState(supabase) }); }
  catch (error) { return NextResponse.json({ result:query.data,message:error.message }, { status:200 }); }
}
