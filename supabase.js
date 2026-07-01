/* ==========================================================================
   SHAKTI SAFETY APP — SUPABASE DATABASE CLIENT
   Anonymous Auth Strategy: No login needed, device-based identity
   ========================================================================== */

const SUPABASE_URL  = 'https://dfjfwnsuhgrxpogwaeeh.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmamZ3bnN1aGdyeHBvZ3dhZWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4OTgxODAsImV4cCI6MjA5ODQ3NDE4MH0.GmIERchvmys0DzeB2P7_MdtpR1Nc2NxnrvjSMw_jDvs';

// Initialize Supabase JS client (v2 CDN)
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// Internal state
let sbUserId = null;        // public.users.id (UUID)
let sbReady   = false;      // true once anonymous sign-in + profile loaded

/* ------------------------------------------------------------------
   INIT: Anonymous Sign-in → Load / Create User Profile
   ------------------------------------------------------------------ */
async function initSupabase() {
  try {
    updateSyncStatus('syncing');

    // Re-use existing session if present
    const { data: { session } } = await sb.auth.getSession();
    const authUser = session?.user ?? (await sb.auth.signInAnonymously()).data?.user;

    if (!authUser) throw new Error('Anonymous sign-in failed');

    await _loadOrCreateProfile(authUser.id);
    sbReady = true;
    updateSyncStatus('connected');
    console.log('[Supabase] Ready. User ID:', sbUserId);
  } catch (err) {
    console.warn('[Supabase] Init failed — running in offline/localStorage mode.', err);
    updateSyncStatus('offline');
  }
}

async function _loadOrCreateProfile(authUid) {
  // Try fetch existing profile row
  const { data: existing } = await sb
    .from('users')
    .select('*')
    .eq('auth_user_id', authUid)
    .maybeSingle();

  if (existing) {
    sbUserId       = existing.id;
    state.userName  = existing.name;
    state.safetyPin = existing.safety_pin;

    // Sync UI fields
    const nameEl = document.getElementById('settings-user-name');
    const pinEl  = document.getElementById('settings-pin');
    if (nameEl) nameEl.value = state.userName;
    if (pinEl)  pinEl.value  = state.safetyPin;
  } else {
    // First time — create profile with current state values
    const { data: created, error } = await sb
      .from('users')
      .insert({
        auth_user_id: authUid,
        name:         state.userName,
        safety_pin:   state.safetyPin
      })
      .select()
      .single();

    if (error) throw error;
    sbUserId = created.id;
  }
}

/* ------------------------------------------------------------------
   SYNC STATUS INDICATOR (cloud icon in header)
   ------------------------------------------------------------------ */
function updateSyncStatus(status) {
  const el = document.getElementById('sync-status-indicator');
  if (!el) return;
  const icons = {
    connected: '<i class="fa-solid fa-cloud" style="color:var(--neon-green);" title="Cloud Synced"></i>',
    syncing:   '<i class="fa-solid fa-cloud-arrow-up fa-beat" style="color:var(--neon-blue);" title="Syncing..."></i>',
    offline:   '<i class="fa-solid fa-cloud-slash" style="color:#ff6b6b;" title="Offline — Local only"></i>'
  };
  el.innerHTML = icons[status] || '';
}

/* ------------------------------------------------------------------
   EMERGENCY CONTACTS — CRUD
   ------------------------------------------------------------------ */

/** Fetch all contacts from Supabase for current user */
async function sbFetchContacts() {
  if (!sbReady || !sbUserId) return null;
  const { data, error } = await sb
    .from('emergency_contacts')
    .select('*')
    .eq('user_id', sbUserId)
    .order('created_at', { ascending: true });
  if (error) { console.warn('[Supabase] fetchContacts:', error); return null; }
  return data; // array of { id, user_id, name, phone, created_at }
}

/** Add a new contact to Supabase; returns the created row (with UUID id) */
async function sbAddContact(name, phone) {
  if (!sbReady || !sbUserId) return null;
  const { data, error } = await sb
    .from('emergency_contacts')
    .insert({ user_id: sbUserId, name, phone })
    .select()
    .single();
  if (error) { console.warn('[Supabase] addContact:', error); return null; }
  return data;
}

/** Delete a contact by its Supabase UUID */
async function sbDeleteContact(supabaseId) {
  if (!sbReady || !sbUserId) return false;
  const { error } = await sb
    .from('emergency_contacts')
    .delete()
    .eq('id', supabaseId)
    .eq('user_id', sbUserId);
  if (error) { console.warn('[Supabase] deleteContact:', error); return false; }
  return true;
}

/* ------------------------------------------------------------------
   USER PROFILE — SAVE
   ------------------------------------------------------------------ */
async function sbSaveProfile(name, pin) {
  if (!sbReady || !sbUserId) return false;
  const { error } = await sb
    .from('users')
    .update({ name, safety_pin: pin })
    .eq('id', sbUserId);
  if (error) { console.warn('[Supabase] saveProfile:', error); return false; }
  return true;
}

/* ------------------------------------------------------------------
   SOS ALERTS — LOG & DEACTIVATE
   ------------------------------------------------------------------ */

/** Log a new SOS trigger event; saves the returned row id in state */
async function sbLogSOS(lat, lng) {
  if (!sbReady || !sbUserId) return;
  const { data, error } = await sb
    .from('sos_alerts')
    .insert({ user_id: sbUserId, latitude: lat, longitude: lng })
    .select()
    .single();
  if (error) { console.warn('[Supabase] logSOS:', error); return; }
  state.activeSOSAlertId = data?.id ?? null;
}

/** Mark the active SOS alert as deactivated */
async function sbDeactivateSOS() {
  if (!sbReady || !state.activeSOSAlertId) return;
  await sb
    .from('sos_alerts')
    .update({ deactivated_at: new Date().toISOString() })
    .eq('id', state.activeSOSAlertId);
  state.activeSOSAlertId = null;
}

/* ------------------------------------------------------------------
   AUDIO RECORDINGS — LOG METADATA
   ------------------------------------------------------------------ */
async function sbLogRecording(filename, durationSeconds) {
  if (!sbReady || !sbUserId) return;
  const { error } = await sb
    .from('recordings_log')
    .insert({ user_id: sbUserId, filename, duration_seconds: durationSeconds });
  if (error) { console.warn('[Supabase] logRecording:', error); }
}
