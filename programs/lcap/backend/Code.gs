/** PMC LCAP intake endpoint.
 * Script Properties required: ADMIN_EMAIL, TURNSTILE_SECRET, SPREADSHEET_ID.
 * Optional: ALLOWED_HOSTNAME (e.g. abdullah8778.github.io).
 * Deploy as Web App: Execute as Me; access Anyone. Never commit secrets.
 */
const REQUIRED_PROPERTIES = ['ADMIN_EMAIL','TURNSTILE_SECRET','SPREADSHEET_ID'];
const FORM_SCHEMAS = {
  application: {required:['name','email','phone','role','specialty','target','goal','hours','start','languages','source'], consent:['processing','contact']},
  discovery: {required:['name','email','phone','role','target','timeline','obstacle','interest','time'], consent:['contact']},
  opportunity: {required:['code','event','employer','role','date','stage','next'], consent:['processing']},
  weekly: {required:['code','week','completed','hours','confidence'], consent:['processing']},
  feedback: {required:['satisfaction','best','improve','recommend'], consent:['processing']}
};
const HEADERS = ['submitted_at','reference','form_type','email','payload_json','source_meta_json','consent_flags_json','language'];

function doPost(e) {
  try {
    const p = e && e.parameter ? e.parameter : {};
    if (String(p.website || '').trim()) return json({ok:true}); // honeypot: discard silently
    if (!p.payload || !p.turnstileToken) return json({ok:false,message:'Missing required fields'});
    const props = PropertiesService.getScriptProperties();
    REQUIRED_PROPERTIES.forEach(k => { if (!props.getProperty(k)) throw new Error('Missing Script Property: '+k); });
    const verdict = verifyTurnstile(p.turnstileToken, props);
    if (!verdict.success) return json({ok:false,message:'Security verification failed'});
    const allowedHost = props.getProperty('ALLOWED_HOSTNAME');
    if (allowedHost && verdict.hostname !== allowedHost) return json({ok:false,message:'Invalid request origin'});
    const data = JSON.parse(p.payload);
    const schema = FORM_SCHEMAS[data.formType];
    if (!schema) return json({ok:false,message:'Unknown form type'});
    validate(data, schema);
    const clean = sanitize(data);
    const ref = 'PMC-LCAP-' + Utilities.getUuid().slice(0,8).toUpperCase();
    const ss = SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID'));
    const sheet = ss.getSheetByName(clean.formType) || ss.insertSheet(clean.formType);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.appendRow([new Date(),ref,clean.formType,clean.email || '',JSON.stringify(clean),JSON.stringify(clean.sourceMeta || {}),JSON.stringify(clean.consentFlags || {}),clean.language || 'ar']);
    const admin = props.getProperty('ADMIN_EMAIL');
    MailApp.sendEmail({to:admin,subject:'PMC LCAP | '+clean.formType+' | '+ref,body:'A new LCAP form was received.\nReference: '+ref+'\nType: '+clean.formType+'\nReview the restricted response sheet.'});
    if (clean.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) {
      MailApp.sendEmail({to:clean.email,subject:'تم استلام طلبك | PMC LCAP',body:'تم استلام النموذج بنجاح. رقم المتابعة: '+ref+'\nسيتم التواصل معك عند الحاجة. إرسال الطلب لا يعني القبول أو ضمان الحصول على وظيفة.'});
    }
    return json({ok:true,reference:ref});
  } catch (err) {
    console.error(err);
    return json({ok:false,message:'Submission could not be processed'});
  }
}
function verifyTurnstile(token, props) {
  const response = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method:'post',payload:{secret:props.getProperty('TURNSTILE_SECRET'),response:token},
    muteHttpExceptions:true
  });
  return JSON.parse(response.getContentText() || '{}');
}
function validate(data, schema) {
  schema.required.forEach(key => {
    const value = data[key];
    if (value === undefined || value === null || String(value).trim() === '') throw new Error('Missing required field: '+key);
  });
  schema.consent.forEach(key => {
    if (!data.consentFlags || data.consentFlags[key] !== true) throw new Error('Required consent missing: '+key);
  });
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) throw new Error('Invalid email');
  if (data.formType === 'weekly' && (Number(data.week)<1 || Number(data.week)>8)) throw new Error('Invalid week');
  if (data.formType === 'weekly' && (Number(data.confidence)<1 || Number(data.confidence)>5)) throw new Error('Invalid confidence');
  if (data.formType === 'feedback' && (Number(data.satisfaction)<1 || Number(data.satisfaction)>5)) throw new Error('Invalid satisfaction');
}
function sanitize(obj) {
  const out = {};
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (key === 'website') return;
    if (value && typeof value === 'object') out[key] = value;
    else out[String(key).slice(0,60)] = String(value === undefined ? '' : value).trim().slice(0,3000);
  });
  return out;
}
function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
