(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{47432:function(e,t,n){Promise.resolve().then(n.bind(n,4874))},4874:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return w}});var a=n(9268),i=n(86006),r=n(24214),s=n(57807),l=n(81771),o=n(23607),c=n(47931),d=n(14864),u=n(4310),g=n(2525),x=n(51710),h=n(95383),m=n(43370),p=n(14240),f=n(44532),j=n(19205),y=n(37595),Z=n(32548),k=n(85712),O=n(27361);let z=async(e,t)=>{try{let n=await (0,r.Z)(e,t);return n.data}catch(e){throw e}},v=e=>{let t=e.split("\n");return t.map((e,t)=>(0,a.jsxs)(i.Fragment,{children:[e,(0,a.jsx)("br",{})]},t))};async function S(e,t,n,a,i){let r=[...e,...t];r.sort((e,t)=>e.id-t.id);let s=await z("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer ".concat(a.apikey),"OpenAI-Organization":"".concat(a.Organization),"Content-Type":"application/json"},data:{model:"gpt-3.5-turbo",messages:r.map(e=>{let{id:t,...n}=e;return n})}});n(e=>[...e,{id:i,role:"assistant",content:s.choices[0].message.content}])}function b(e,t){if(0===e.length&&0===t.length)return 1;let n=[...e,...t],a=Math.max(...n.map(e=>e.id));return a+1}async function C(e,t){try{await z("https://api.openai.com/v1/models",{method:"GET",headers:{Authorization:"Bearer ".concat(t.apikey),"OpenAI-Organization":"".concat(t.Organization)}}),e(!0)}catch(t){e(!1)}}function E(e,t,n,a,i,r){i(i=>{if(null===n)return[...i,{id:b(e,t),role:"user",content:a}];{let e=i.findIndex(e=>e.id===n),t=[...i];return t[e].content=a,t}}),null!==n&&r(e=>{e.pop();let t=[...e];return t})}function w(){let[e,t]=(0,i.useState)([]),[n,r]=(0,i.useState)([]),[z,w]=(0,i.useState)([]),[I,T]=(0,i.useState)(""),[A,B]=(0,i.useState)(!1),[P,_]=(0,i.useState)(null),[N,R]=(0,i.useState)(null),[D,K]=(0,i.useState)(null),[W,F]=(0,i.useState)({Organization:"",apikey:""});(0,i.useEffect)(()=>{t(()=>{let e=[...n,...z];return e.sort((e,t)=>e.id-t.id),e})},[n,z]);let M=async()=>{B(!0),_(null);try{await S(n,z,w,W,b(n,z))}catch(e){_(e.message),r(e=>{e.pop();let t=[...e];return t})}finally{B(!1),T(""),R(null)}};return(0,i.useEffect)(()=>{n.length>0&&M()},[n]),(0,i.useEffect)(()=>{F(()=>({apikey:localStorage.getItem("apikey"),Organization:localStorage.getItem("Organization")}))},[]),(0,i.useEffect)(()=>{C(K,W)},[W]),(0,i.useEffect)(()=>{""!==W.apikey&&localStorage.setItem("apikey",W.apikey)},[W.apikey]),(0,i.useEffect)(()=>{""!==W.Organization&&localStorage.setItem("Organization",W.Organization)},[W.Organization]),(0,a.jsxs)(s.Z,{maxWidth:"md",children:[(0,a.jsx)("h1",{children:"Test ChatGPT"}),(0,a.jsxs)(g.Z,{sx:{marginBottom:"1em",maxWidth:"60%"},elevation:2,children:[(0,a.jsxs)(x.Z,{expandIcon:(0,a.jsx)(m.Z,{}),children:[(0,a.jsx)("span",{style:{marginRight:"2em",fontWeight:700},children:"API Config"})," ",D?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(f.Z,{color:"success",sx:{marginRight:"4px"}}),"Logged in!"]}):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(j.Z,{color:"error",sx:{marginRight:"4px"}}),"Not logged in."]})]}),(0,a.jsxs)(h.Z,{children:[(0,a.jsx)(o.Z,{label:"Organization ID",type:"text",sx:{marginRight:"4px",marginBottom:"8px"},value:W.Organization,onChange:e=>{F(t=>({...t,Organization:e.target.value}))}}),(0,a.jsx)(o.Z,{label:"API KEY",type:"password",sx:{marginBottom:"8px"},value:W.apikey,onChange:e=>F(t=>({...t,apikey:e.target.value}))}),(0,a.jsx)(l.Z,{})]})]}),P&&(0,a.jsx)(u.Z,{severity:"error",children:P}),(0,a.jsxs)(l.Z,{sx:{margin:"1em"},children:[e.map((e,t)=>(0,a.jsxs)(l.Z,{children:[(0,a.jsx)("h2",{children:e.role}),(0,a.jsx)(l.Z,{children:"user"===e.role?v(e.content):(0,a.jsx)(Z.D,{children:e.content,components:{code(e){let{node:t,inline:n,className:i,children:r,...s}=e,l=/language-(\w+)/.exec(i||"");return!n&&l?(0,a.jsx)(k.Z,{...s,children:String(r).replace(/\n$/,""),style:O.Z,language:l[1],PreTag:"div"}):(0,a.jsx)("code",{...s,className:i,children:r})}}})}),(0,a.jsx)(l.Z,{}),e.id===Math.max(...n.map(e=>e.id))?(0,a.jsxs)(l.Z,{justifyContent:"flex-end",display:"flex",sx:{margin:"1em"},children:[(0,a.jsx)(c.Z,{color:"secondary",onClick:()=>{R(e.id),T(e.content)},variant:"contained",disabled:!!N||!!A,children:"Edit"}),N?(0,a.jsx)(c.Z,{color:"error",sx:{marginLeft:"1em"},onClick:()=>R(null),disabled:A,children:"Cancel"}):""]}):"",(0,a.jsx)("hr",{})]},t)),A?(0,a.jsx)(d.Z,{color:"secondary"}):""]}),(0,a.jsxs)(l.Z,{children:[(0,a.jsx)(p.Z,{sx:{marginBottom:"1.5em",marginTop:"2em"},children:N?(0,a.jsx)(y.Z,{label:"Edit Mode"}):""}),(0,a.jsx)(o.Z,{id:"outlined-multiline-flexible",label:"message",multiline:!0,maxRows:100,fullWidth:!0,value:I,onChange:e=>T(e.target.value),disabled:A,onKeyDown:e=>{"Enter"===e.key&&(e.ctrlKey||e.metaKey)&&E(n,z,N,I,r,w)}}),(0,a.jsx)(l.Z,{flexDirection:"row",justifyContent:"flex-end",display:"flex",children:(0,a.jsx)(c.Z,{sx:{margin:"1em"},onClick:()=>E(n,z,N,I,r,w),variant:"contained",disabled:A,children:A?"sending...":"send"})})]})]})}}},function(e){e.O(0,[287,667,488,744],function(){return e(e.s=47432)}),_N_E=e.O()}]);