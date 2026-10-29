(function(){
"use strict";
var id=String(window.JIEUM_GA4_MEASUREMENT_ID||"").trim().toUpperCase();
var valid=/^G-[A-Z0-9]{6,16}$/.test(id);
var key="jieum_analytics_consent_v1";
var enabled=false;
var memoryConsent=null;
function readConsent(){try{return localStorage.getItem(key)||memoryConsent;}catch(e){return memoryConsent;}}
function saveConsent(v){memoryConsent=v;try{localStorage.setItem(key,v);}catch(e){}}
function loadAnalytics(){
 if(!valid || enabled)return;
 enabled=true;
 window.dataLayer=window.dataLayer||[];
 window.gtag=function(){window.dataLayer.push(arguments);};
 window.gtag("js",new Date());
 window.gtag("config",id,{send_page_view:true});
 var script=document.createElement("script");
 script.async=true;
 script.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(id);
 document.head.appendChild(script);
}
window.jieumTrack=function(eventName,params){
 if(!enabled || typeof window.gtag!=="function")return;
 if(!/^[a-z][a-z0-9_]{2,40}$/.test(eventName))return;
 var safe={},src=params||{};
 ["contact_method","link_location","form_type","page_type"].forEach(function(k){
  if(typeof src[k]==="string")safe[k]=src[k].slice(0,80);
 });
 window.gtag("event",eventName,safe);
};
function addConsentBanner(){
 if(!valid || readConsent())return;
 var box=document.createElement("div");
 box.id="jieum-consent-bar";
 box.setAttribute("role","region");box.setAttribute("aria-label","방문 통계 이용 선택");
 box.style.cssText="position:fixed;z-index:9998;left:12px;right:12px;bottom:12px;max-width:940px;margin:0 auto;background:#fff;color:#1b2733;border:1px solid #d5d0c6;box-shadow:0 14px 36px rgba(0,0,0,.22);border-radius:12px;padding:15px 19px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;font:14px/1.6 Pretendard,'Noto Sans KR',Arial,sans-serif";
 box.innerHTML='<div style="flex:1 1 310px"><strong>방문 통계 수집 안내</strong><div>사이트 이용 현황을 분석하기 위한 쿠키 사용에 동의하시겠습니까? 거부해도 이용에 제한이 없습니다. <a href="/privacy-info.html" style="color:#5b3f83">자세히 보기</a></div></div><div style="display:flex;gap:8px"><button type="button" data-choice="deny" style="border:1px solid #abb0b6;background:white;border-radius:6px;padding:8px 14px;cursor:pointer">거부</button><button type="button" data-choice="allow" style="border:0;background:#2d3243;color:white;border-radius:6px;padding:8px 14px;cursor:pointer">동의</button></div>';
 box.addEventListener("click",function(ev){var btn=ev.target.closest("button[data-choice]");if(!btn)return;var v=btn.getAttribute("data-choice")==="allow"?"allow":"deny";saveConsent(v);box.remove();if(v==="allow")loadAnalytics();});
 document.body.appendChild(box);
}
window.jieumPrivacySettings=function(){
 if(!valid){return false;}
 try{localStorage.removeItem(key);}catch(e){}
 memoryConsent=null;
 var old=document.getElementById("jieum-consent-bar");if(old)old.remove();
 addConsentBanner();return true;
};
function trackContacts(){
 document.addEventListener("click",function(e){
  var a=e.target.closest("a[href]");if(!a)return;
  var h=a.getAttribute("href")||"";
  var method=h.indexOf("open.kakao.com")>=0?"kakao":h.indexOf("tel:")===0?"phone":h.indexOf("mailto:")===0?"email":null;
  if(method)window.jieumTrack("contact_click",{contact_method:method,link_location:location.pathname.slice(0,80)});
  if(h.indexOf("/quote-request.html")===0)window.jieumTrack("quote_page_link_click",{page_type:"production_quote"});
 });
}
if(readConsent()==="allow"&&valid)loadAnalytics();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){addConsentBanner();trackContacts();});
else{addConsentBanner();trackContacts();}
})();