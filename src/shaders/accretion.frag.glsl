// Emission model for a geometrically thin disk. Radii are in Schwarzschild units.
float hash31(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash31(i),hash31(i+vec3(1,0,0)),f.x),mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x),mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x),f.y),f.z);}
vec4 diskEmission(vec3 p,vec3 ray){
 float radius=length(p.xz);
 float inner=3.0,outer=12.5;
 float edge=smoothstep(inner,inner+.45,radius)*(1.-smoothstep(8.5,outer,radius));
 if(edge<.001)return vec4(0);
 float a=atan(p.z,p.x);
 float speed=uTime*.27/pow(radius*.24,1.5);
 vec3 flow=vec3(cos(a+speed)*radius,sin(a+speed)*radius,radius*.7);
 float n=noise3(flow*2.9);
 n+=.48*noise3(flow*6.4+vec3(0.,0.,uTime*.06));
 if(uDetail>0.5)n+=.22*noise3(flow*14.0);
 float bands=sin(radius*26.+n*7.5+sin(a*5.+speed)*.8)*.5+.5;
 float fine=sin(radius*58.+n*11.)*.5+.5;
 float pattern=.2+n*.57+bands*.20+fine*.06;
 float hot=pow(3./radius,1.9);
 vec3 color=mix(vec3(.48,.09,.012),vec3(1.8,.67,.14),smoothstep(0.,.65,hot));
 color=mix(color,vec3(3.0,2.2,1.2),pow(hot,2.8));
 vec3 tangent=normalize(vec3(-p.z,0.,p.x));
 float toward=dot(tangent,-normalize(ray));
 float beta=sqrt(.5/max(radius-1.,1.));
 float doppler=sqrt(1.-beta*beta)/(1.-beta*toward);
 float redshift=sqrt(max(.01,1.-1./radius));
 float boosting=clamp(pow(doppler*redshift,3.),.28,3.1);
 float intensity=pattern*edge*(.8+hot*2.)*boosting;
 return vec4(color*intensity,clamp(edge*.84,0.,.96));
}
