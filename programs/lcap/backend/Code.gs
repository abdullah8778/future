/** LCAP secure intake — Google Apps Script
 * Required Script Properties: ADMIN_EMAIL, TURNSTILE_SECRET, SPREADSHEET_ID
 * Deploy as Web App: Execute as Me; access Anyone. Protect with Cloudflare Turnstile.
 */
const REQUIRED = ['ADMIN_EMAIL','TURNSTILE_SECRET','SPREADSHEET_ID'];
const ALLOWED = ['application','baseline','weekly','interview','followup30','followup60','ambassador'];

function doPost(e) {
  try {
    const p = e && e.parameter ? e.parameter : {};
    if (!p.payload || !p.turnstileToken) return out({ok:false,message:'Missing required fields'});
    const props = PropertiesService.getScriptProperties();
    REQUIRED.forEach(k => { if (!props.getProperty(k)) throw new Error('Server configuration incomplete: '+k); });
    if (String(p.website || '').trim()) return out({ok:true}); // honeypot
    const verify = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method:'post', payload:{secret:props.getProperty('TURNSTILE_SECRET'),response:p.turnstileToken},
      muteHttpExceptions:true
    });
    const verdict = JSON.parse(verify.getContentText() || '{}');
    if (!verdict.success) return out({ok:false,message:'Verification failed'});
    const data = JSON.parse(p.payload);
    if (!ALLOWED.includes(data.formType)) return out({ok:false,message:'Unknown form type'});
    const clean = sanitize(data);
    const ss = SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID'));
    const sheet = ss.getSheetByName(clean.formType) || ss.insertSheet(clean.formType);
    const fields = Object.keys(clean).filter(k=>k!=='formType');
    if (sheet.getLastRow()===0) sheet.appendRow(['Submitted At','Reference',...fields]);
    const ref = 'LCAP-'+Utilities.getUuid().slice(0,8).toUpperCase();
    sheet.appendRow([new Date(),ref,...fields.map(k=>clean[k])]);
    const admin = props.getProperty('ADMIN_EMAIL');
    const subject = 'LCAP | New '+clean.formType+' submission | '+ref;
    const summary = fields.map(k=>k+': '+String(clean[k] || '').slice(0,500)).join('\n');
    MailApp.sendEmail({to:admin,subject,body:'New LCAP submission received.\nReference: '+ref+'\nType: '+clean.formType+'\n\n'+summary+'\n\nOpen the restricted LCAP response spreadsheet to review.'});
    if (clean.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) {
      MailApp.sendEmail({to:clean.email,subject:'تم استلام طلبك | LCAP',body:'تم استلام النموذج بنجاح. رقم المتابعة: '+ref+'\nسيتم التواصل معك عند الانتقال للمرحلة التالية. لا يعني إرسال الطلب القبول في البرنامج.'});
    }
    return out({ok:true,reference:ref});
  } catch(err) {
    console.error(err);
    return out({ok:false,message:'Submission could not be processed'});
  }
}
function sanitize(obj) {
  const result={formType:String(obj.formType||'').slice(0,30)};
  Object.keys(obj).forEach(k=>{
    if(k==='formType') return;
    const v=obj[k];
    result[String(k).slice(0,60)] = (typeof v==='string' ? v.trim().slice(0,3000) : String(v).slice(0,3000));
  });
  return result;
}
function out(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
