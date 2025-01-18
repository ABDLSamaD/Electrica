import{R as l,o as g,u as v,S as j,r as p,j as e,m as y,N as w,O as N}from"./index-DAFeV0zj.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=l("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=l("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=l("CircleHelp",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=l("FolderOpenDot",[["path",{d:"m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2",key:"1nmvlm"}],["circle",{cx:"14",cy:"15",r:"1",key:"1gm4qj"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=l("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=l("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=l("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=l("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]),k=g.create({baseURL:"http://localhost:5120",withCredentials:!0});k.interceptors.response.use(s=>s,s=>s.response&&s.response.status===401?Promise.resolve({data:{isAuthenticated:!1}}):Promise.reject(s));const M=[{id:1,label:"Dashboard",icon:A,link:"/db_au_admn"},{id:2,label:"Users",icon:H,link:"/db_au_admn/userprofile"},{id:3,label:"Projects",icon:_,link:"/db_au_admn/projectusers"},{id:4,label:"Settings",icon:z,link:"/settings"},{id:5,label:"Help",icon:S,link:"/help"}],U=({connection:s,admin:h})=>{const x=v(),b=j(),c=a=>b.pathname===a,[i,f]=p.useState(!0),m=()=>f(!i),u=async()=>{var a,d;try{const n=await k.post("/api/adminauth/logout",{});n.status===200?(alert(n.data.message),x("/admn-sign")):alert(n.data.message)}catch(n){alert((d=(a=n.response)==null?void 0:a.data)==null?void 0:d.message)}};return e.jsx(y.div,{className:"fixed top-0 left-0 h-screen bg-black/50 backdrop-blur-lg text-white z-20 border-r border-white/10",animate:{width:i?"210px":"70px"},transition:{duration:.3,ease:"easeInOut"},children:e.jsxs("div",{className:"flex flex-col h-full",children:[e.jsxs("div",{className:"flex items-center justify-between p-4",children:[i&&e.jsx(y.h1,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent",children:(h==null?void 0:h.username)||"Admin"}),e.jsx("button",{onClick:m,className:"p-2 rounded-full hover:bg-white/10 transition-colors",children:i?e.jsx(C,{size:24}):e.jsx(L,{size:24})})]}),e.jsx("nav",{className:"flex-1 mt-6",children:e.jsx("ul",{children:M.map(a=>e.jsx("li",{className:`flex items-center px-4 py-3 ${c(a.link)?"bg-cyan-600 text-white":"hover:bg-white/10 hover:text-gray-50"} transition-colors`,children:e.jsxs(w,{to:a.link,className:({isActive:d})=>`flex items-center px-4 py-3 rounded-lg transition-colors ${d?"bg-cyan-600 text-white":"hover:bg-white/10 hover:text-gray-50"}`,end:a.link==="/db_au_admn",children:[e.jsx(a.icon,{size:22}),i&&e.jsx(y.span,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"ml-4 text-white text-base",children:a.label})]})},a.id))})}),e.jsx("div",{className:"p-4",children:e.jsxs("button",{className:"flex items-center w-full px-4 py-2 text-white hover:bg-white/10 transition-colors rounded bg-gray-900",onClick:u,children:[e.jsx(O,{size:28}),i&&e.jsx(y.span,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"ml-4 text-lg text-cyan-300",children:"Logout"})]})})]})})},P=()=>{const s="http://localhost:5120",[h,x]=p.useState(""),[b,c]=p.useState([]),[i,f]=p.useState([]),[m,u]=p.useState(""),a=async()=>{var r,o;try{const t=await g.get(`${s}/api/adminAuth/get_admin`,{withCredentials:!0});t.status===200?setTimeout(()=>{x(t.data)},1080):x("")}catch(t){x(""),u((o=(r=t.response)==null?void 0:r.data)==null?void 0:o.message)}},d=async()=>{var r,o;try{const t=await g.get(`${s}/api/adminAuth/get_all_users`,{withCredentials:!0});t.status===200?setTimeout(()=>{c(t.data)},1001):c([])}catch(t){c([]),u((o=(r=t.response)==null?void 0:r.data)==null?void 0:o.message)}},n=async()=>{var r,o;try{const t=await g.get(`${s}/api/adminauth/project-details`,{withCredentials:!0});t.status===200?setTimeout(()=>{f(t.data)},1001):c([])}catch(t){c([]),u((o=(r=t.response)==null?void 0:r.data)==null?void 0:o.message)}};return p.useEffect(()=>{a(),d(),n()},[]),e.jsxs("div",{className:"flex h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white",children:[e.jsx(U,{connection:s,admin:h}),e.jsx("main",{className:"flex-1 p-1 lg:p-2 ml-[67px] lg:ml-[60px] overflow-y-auto",children:e.jsx("div",{className:"max-w-full mx-auto",children:e.jsxs("div",{className:"backdrop-blur-md bg-white/10 shadow-lg min-h-screen md:p-5 p-2",children:[m&&e.jsx("p",{children:m}),e.jsx(N,{context:{admin:h,users:b,projects:i,localhost:s,fetchUsers:d,fetchProject:n}})]})})})]})};export{P as default};
