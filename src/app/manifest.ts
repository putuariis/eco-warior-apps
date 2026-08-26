import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest { return { name:'ECO-WARRIOR: ZERO WASTE CLIMATE WAR', short_name:'ECO-WARRIOR', description:'Competitive climate action game', start_url:'/', display:'standalone', background_color:'#07110d', theme_color:'#67f29a', icons:[{src:'/icons/logo.svg',sizes:'any',type:'image/svg+xml'}]}; }
