import"./rolldown-runtime-CNC7AqOf.js";import{n as e,t}from"./react-K5XiZLH2.js";import{t as n}from"./compiler-runtime-BbCBI_et.js";import{Ct as r,F as i,Gr as a,S as o,Wr as s,ht as c,k as l}from"./dist-BkxdqowW.js";import{Ci as u,Jr as d,Qi as f,Si as p,Vt as m,_i as h,bi as g,di as _,fi as v,gi as y,lo as b,pi as x,qr as S,ui as C,vi as w,xi as T}from"./sanity-DGRB0Kk_.js";var E=e(),D=n();t(),b(),T(),g(),y(),w(),x(),p(),u(),h(),f(),v(),_(),C();var O=1,k=3,A=a(l).withConfig({displayName:`RootFlex`,componentId:`sc-1y8zfkj-0`})(({theme:e})=>s`
    min-height: 100%;

    @media (max-width: ${e.sanity.media[k]}px) {
      position: relative;
    }
  `),j=a(i).withConfig({displayName:`SidebarMotionLayer`,componentId:`sc-1y8zfkj-1`})(({theme:e})=>{let t=e.sanity.media;return s`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 360px;
    border-left: 1px solid var(--card-border-color);
    box-sizing: border-box;
    overflow: hidden;

    box-shadow:
      0px 6px 8px -4px var(--card-shadow-umbra-color),
      0px 12px 17px -1px var(--card-shadow-penumbra-color);

    @media (max-width: ${t[k]}px) {
      bottom: 0;
      position: absolute;
      right: 0;
      top: 0;
    }

    @media (max-width: ${t[O]}px) {
      border-left: 0;
      min-width: 100%;
      left: 0;
    }
  `});function M(e){let t=(0,D.c)(12),n=c(),{state:i}=d(),{isOpen:a}=i,s=n<=O&&a?`hidden`:`auto`,l;t[0]===e?l=t[1]:(l=e.renderDefault(e),t[0]=e,t[1]=l);let u;t[2]!==s||t[3]!==l?(u=(0,E.jsx)(o,{flex:1,height:`fill`,overflow:s,children:l}),t[2]=s,t[3]=l,t[4]=u):u=t[4];let f;t[5]===a?f=t[6]:(f=a&&(0,E.jsx)(j,{zOffset:100,height:`fill`,children:(0,E.jsx)(m,{})}),t[5]=a,t[6]=f);let p;t[7]===f?p=t[8]:(p=(0,E.jsx)(r,{initial:!1,children:f}),t[7]=f,t[8]=p);let h;return t[9]!==u||t[10]!==p?(h=(0,E.jsxs)(A,{sizing:`border`,height:`fill`,children:[u,p]}),t[9]=u,t[10]=p,t[11]=h):h=t[11],h}function N(e){let t=(0,D.c)(4),{enabled:n}=S();if(!n){let n;return t[0]===e?n=t[1]:(n=e.renderDefault(e),t[0]=e,t[1]=n),n}let r;return t[2]===e?r=t[3]:(r=(0,E.jsx)(M,{...e}),t[2]=e,t[3]=r),r}export{N as TasksStudioActiveToolLayout};