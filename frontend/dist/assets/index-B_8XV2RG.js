import{r as n,Y as k,j as x,Z as z,_ as I,$ as L,a0 as S}from"./index-DJKibhNV.js";class b extends n.Component{getSnapshotBeforeUpdate(c){const t=this.props.childRef.current;if(t&&c.isPresent&&!this.props.isPresent){const s=this.props.sizeRef.current;s.height=t.offsetHeight||0,s.width=t.offsetWidth||0,s.top=t.offsetTop,s.left=t.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function A({children:r,isPresent:c}){const t=n.useId(),s=n.useRef(null),a=n.useRef({width:0,height:0,top:0,left:0}),{nonce:C}=n.useContext(k);return n.useInsertionEffect(()=>{const{width:p,height:e,top:f,left:d}=a.current;if(c||!s.current||!p||!e)return;s.current.dataset.motionPopId=t;const l=document.createElement("style");return C&&(l.nonce=C),document.head.appendChild(l),l.sheet&&l.sheet.insertRule(`
          [data-motion-pop-id="${t}"] {
            position: absolute !important;
            width: ${p}px !important;
            height: ${e}px !important;
            top: ${f}px !important;
            left: ${d}px !important;
          }
        `),()=>{document.head.removeChild(l)}},[c]),x.jsx(b,{isPresent:c,childRef:s,sizeRef:a,children:n.cloneElement(r,{ref:s})})}const B=({children:r,initial:c,isPresent:t,onExitComplete:s,custom:a,presenceAffectsLayout:C,mode:p})=>{const e=z(D),f=n.useId(),d=n.useCallback(i=>{e.set(i,!0);for(const g of e.values())if(!g)return;s&&s()},[e,s]),l=n.useMemo(()=>({id:f,initial:c,isPresent:t,custom:a,onExitComplete:d,register:i=>(e.set(i,!1),()=>e.delete(i))}),C?[Math.random(),d]:[t,d]);return n.useMemo(()=>{e.forEach((i,g)=>e.set(g,!1))},[t]),n.useEffect(()=>{!t&&!e.size&&s&&s()},[t]),p==="popLayout"&&(r=x.jsx(A,{isPresent:t,children:r})),x.jsx(I.Provider,{value:l,children:r})};function D(){return new Map}const y=r=>r.key||"";function w(r){const c=[];return n.Children.forEach(r,t=>{n.isValidElement(t)&&c.push(t)}),c}const U=({children:r,exitBeforeEnter:c,custom:t,initial:s=!0,onExitComplete:a,presenceAffectsLayout:C=!0,mode:p="sync"})=>{const e=n.useMemo(()=>w(r),[r]),f=e.map(y),d=n.useRef(!0),l=n.useRef(e),i=z(()=>new Map),[g,P]=n.useState(e),[h,M]=n.useState(e);L(()=>{d.current=!1,l.current=e;for(let u=0;u<h.length;u++){const o=y(h[u]);f.includes(o)?i.delete(o):i.get(o)!==!0&&i.set(o,!1)}},[h,f.length,f.join("-")]);const E=[];if(e!==g){let u=[...e];for(let o=0;o<h.length;o++){const m=h[o],v=y(m);f.includes(v)||(u.splice(o,0,m),E.push(m))}p==="wait"&&E.length&&(u=E),M(w(u)),P(e);return}const{forceRender:R}=n.useContext(S);return x.jsx(x.Fragment,{children:h.map(u=>{const o=y(u),m=e===h||f.includes(o),v=()=>{if(i.has(o))i.set(o,!0);else return;let j=!0;i.forEach($=>{$||(j=!1)}),j&&(R==null||R(),M(l.current),a&&a())};return x.jsx(B,{isPresent:m,initial:!d.current||s?void 0:!1,custom:m?void 0:t,presenceAffectsLayout:C,mode:p,onExitComplete:m?void 0:v,children:u},o)})})};export{U as A};