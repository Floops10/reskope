import{n as e,s as t}from"./jsx-runtime-BseJUIpC.js";import{P as n}from"./index-DSXl1Nwo.js";import{B as r,C as i,E as a,F as o,I as s,L as c,M as l,R as u,S as d,T as f,_ as p,a as m,d as h,f as g,g as _,h as v,i as y,j as ee,l as b,m as x,n as te,p as S,r as C,u as w,v as ne,x as T,y as E,z as D}from"./react-three-fiber.esm-vevKlU1s.js";function O(){return O=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},O.apply(null,arguments)}var k=t(e()),re=t(n()),A=new c,j=new c,ie=new c,M=new s;function ae(e,t,n){let r=A.setFromMatrixPosition(e.matrixWorld);r.project(t);let i=n.width/2,a=n.height/2;return[r.x*i+i,-(r.y*a)+a]}function oe(e,t){let n=A.setFromMatrixPosition(e.matrixWorld),r=j.setFromMatrixPosition(t.matrixWorld),i=n.sub(r),a=t.getWorldDirection(ie);return i.angleTo(a)>Math.PI/2}function se(e,t,n,r){let i=A.setFromMatrixPosition(e.matrixWorld),a=i.clone();a.project(t),M.set(a.x,a.y),n.setFromCamera(M,t);let o=n.intersectObjects(r,!0);if(o.length){let e=o[0].distance;return i.distanceTo(n.ray.origin)<e}return!0}function ce(e,t){if(t instanceof f)return t.zoom;if(t instanceof a){let n=A.setFromMatrixPosition(e.matrixWorld),r=j.setFromMatrixPosition(t.matrixWorld),i=t.fov*Math.PI/180,a=n.distanceTo(r);return 1/(2*Math.tan(i/2)*a)}else return 1}function le(e,t,n){if(t instanceof a||t instanceof f){let r=A.setFromMatrixPosition(e.matrixWorld),i=j.setFromMatrixPosition(t.matrixWorld),a=r.distanceTo(i),o=(n[1]-n[0])/(t.far-t.near),s=n[1]-o*t.far;return Math.round(o*a+s)}}var N=e=>Math.abs(e)<1e-10?0:e;function P(e,t,n=``){let r=`matrix3d(`;for(let n=0;n!==16;n++)r+=N(t[n]*e.elements[n])+(n===15?`)`:`,`);return n+r}var ue=(e=>t=>P(t,e))([1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1]),de=(e=>(t,n)=>P(t,e(n),`translate(-50%,-50%)`))(e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1]);function fe(e){return e&&typeof e==`object`&&`current`in e}var F=k.forwardRef(({children:e,eps:t=.001,style:n,className:r,prepend:i,center:a,fullscreen:o,portal:s,distanceFactor:l,sprite:u=!1,transform:d=!1,occlude:f,onOcclude:p,castShadow:m,receiveShadow:h,material:g,geometry:_,zIndexRange:v=[16777271,0],calculatePosition:y=ae,as:ee=`div`,wrapperClass:b,pointerEvents:x=`auto`,...S},w)=>{let{gl:ne,camera:T,scene:E,size:D,raycaster:A,events:j,viewport:ie}=C(),[M]=k.useState(()=>document.createElement(ee)),P=k.useRef(null),F=k.useRef(null),I=k.useRef(0),L=k.useRef([0,0]),R=k.useRef(null),z=k.useRef(null),B=s?.current||j.connected||ne.domElement.parentNode,V=k.useRef(null),H=k.useRef(!1),U=k.useMemo(()=>f&&f!==`blending`||Array.isArray(f)&&f.length&&fe(f[0]),[f]);k.useLayoutEffect(()=>{let e=ne.domElement;f&&f===`blending`?(e.style.zIndex=`${Math.floor(v[0]/2)}`,e.style.position=`absolute`,e.style.pointerEvents=`none`):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[f]),k.useLayoutEffect(()=>{if(F.current){let e=P.current=re.createRoot(M);if(E.updateMatrixWorld(),d)M.style.cssText=`position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;`;else{let e=y(F.current,T,D);M.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return B&&(i?B.prepend(M):B.appendChild(M)),()=>{B&&B.removeChild(M),e.unmount()}}},[B,d]),k.useLayoutEffect(()=>{b&&(M.className=b)},[b]);let W=k.useMemo(()=>d?{position:`absolute`,top:0,left:0,width:D.width,height:D.height,transformStyle:`preserve-3d`,pointerEvents:`none`}:{position:`absolute`,transform:a?`translate3d(-50%,-50%,0)`:`none`,...o&&{top:-D.height/2,left:-D.width/2,width:D.width,height:D.height},...n},[n,a,o,D,d]),pe=k.useMemo(()=>({position:`absolute`,pointerEvents:x}),[x]);k.useLayoutEffect(()=>{if(H.current=!1,d){var t;(t=P.current)==null||t.render(k.createElement(`div`,{ref:R,style:W},k.createElement(`div`,{ref:z,style:pe},k.createElement(`div`,{ref:w,className:r,style:n,children:e}))))}else{var i;(i=P.current)==null||i.render(k.createElement(`div`,{ref:w,style:W,className:r,children:e}))}});let G=k.useRef(!0);te(e=>{if(F.current){T.updateMatrixWorld(),F.current.updateWorldMatrix(!0,!1);let e=d?L.current:y(F.current,T,D);if(d||Math.abs(I.current-T.zoom)>t||Math.abs(L.current[0]-e[0])>t||Math.abs(L.current[1]-e[1])>t){let t=oe(F.current,T),n=!1;U&&(Array.isArray(f)?n=f.map(e=>e.current):f!==`blending`&&(n=[E]));let r=G.current;n?G.current=se(F.current,T,A,n)&&!t:G.current=!t,r!==G.current&&(p?p(!G.current):M.style.display=G.current?`block`:`none`);let i=Math.floor(v[0]/2),a=f?U?[v[0],i]:[i-1,0]:v;if(M.style.zIndex=`${le(F.current,T,a)}`,d){let[e,t]=[D.width/2,D.height/2],n=T.projectionMatrix.elements[5]*t,{isOrthographicCamera:r,top:i,left:a,bottom:o,right:s}=T,c=ue(T.matrixWorldInverse),d=r?`scale(${n})translate(${N(-(s+a)/2)}px,${N((i+o)/2)}px)`:`translateZ(${n}px)`,f=F.current.matrixWorld;u&&(f=T.matrixWorldInverse.clone().transpose().copyPosition(f).scale(F.current.scale),f.elements[3]=f.elements[7]=f.elements[11]=0,f.elements[15]=1),M.style.width=D.width+`px`,M.style.height=D.height+`px`,M.style.perspective=r?``:`${n}px`,R.current&&z.current&&(R.current.style.transform=`${d}${c}translate(${e}px,${t}px)`,z.current.style.transform=de(f,1/((l||10)/400)))}else{let t=l===void 0?1:ce(F.current,T)*l;M.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}L.current=e,I.current=T.zoom}}if(!U&&V.current&&!H.current)if(d){if(R.current){let e=R.current.children[0];if(e!=null&&e.clientWidth&&e!=null&&e.clientHeight){let{isOrthographicCamera:t}=T;if(t||_)S.scale&&(Array.isArray(S.scale)?S.scale instanceof c?V.current.scale.copy(S.scale.clone().divideScalar(1)):V.current.scale.set(1/S.scale[0],1/S.scale[1],1/S.scale[2]):V.current.scale.setScalar(1/S.scale));else{let t=(l||10)/400,n=e.clientWidth*t,r=e.clientHeight*t;V.current.scale.set(n,r,1)}H.current=!0}}}else{let t=M.children[0];if(t!=null&&t.clientWidth&&t!=null&&t.clientHeight){let e=1/ie.factor,n=t.clientWidth*e,r=t.clientHeight*e;V.current.scale.set(n,r,1),H.current=!0}V.current.lookAt(e.camera.position)}});let K=k.useMemo(()=>({vertexShader:d?void 0:`
          /*
            This shader is from the THREE's SpriteMaterial.
            We need to turn the backing plane into a Sprite
            (make it always face the camera) if "transfrom"
            is false.
          */
          #include <common>

          void main() {
            vec2 center = vec2(0., 1.);
            float rotation = 0.0;

            // This is somewhat arbitrary, but it seems to work well
            // Need to figure out how to derive this dynamically if it even matters
            float size = 0.03;

            vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
            vec2 scale;
            scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
            scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

            bool isPerspective = isPerspectiveMatrix( projectionMatrix );
            if ( isPerspective ) scale *= - mvPosition.z;

            vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale * size;
            vec2 rotatedPosition;
            rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
            rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
            mvPosition.xy += rotatedPosition;

            gl_Position = projectionMatrix * mvPosition;
          }
      `,fragmentShader:`
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
      `}),[d]);return k.createElement(`group`,O({},S,{ref:F}),f&&!U&&k.createElement(`mesh`,{castShadow:m,receiveShadow:h,ref:V},_||k.createElement(`planeGeometry`,null),g||k.createElement(`shaderMaterial`,{side:2,vertexShader:K.vertexShader,fragmentShader:K.fragmentShader})))}),I=parseInt(`185`.replace(/\D+/g,``)),L=I>=125?`uv1`:`uv2`,R=new m,z=new c,B=class extends v{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type=`LineSegmentsGeometry`,this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute(`position`,new g([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute(`uv`,new g([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new _(t,6,1);return this.setAttribute(`instanceStart`,new p(n,3,0)),this.setAttribute(`instanceEnd`,new p(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let r=new _(n,t*2,1);return this.setAttribute(`instanceColorStart`,new p(r,t,0)),this.setAttribute(`instanceColorEnd`,new p(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new r(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new m);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),R.setFromBufferAttribute(t),this.boundingBox.union(R))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new l),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)z.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(z)),z.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(z));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.`,this)}}toJSON(){}applyMatrix(e){return console.warn(`THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().`),this.applyMatrix4(e)}},V=class extends B{constructor(){super(),this.isLineGeometry=!0,this.type=`LineGeometry`}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,r=new Float32Array(2*n);if(t===3)for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];else for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5],r[2*i+6]=e[i+6],r[2*i+7]=e[i+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}},H=class extends ee{constructor(e){super({type:`LineMaterial`,uniforms:o.clone(o.merge([y.common,y.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new s(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${I>=154?`colorspace_fragment`:`encodings_fragment`}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA=`1`:delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return`WORLD_UNITS`in this.defines},set:function(e){e===!0?this.defines.WORLD_UNITS=``:delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return`USE_DASH`in this.defines},set(e){!!e!=`USE_DASH`in this.defines&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH=``:delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return`USE_ALPHA_TO_COVERAGE`in this.defines},set:function(e){!!e!=`USE_ALPHA_TO_COVERAGE`in this.defines&&(this.needsUpdate=!0),e===!0?(this.defines.USE_ALPHA_TO_COVERAGE=``,this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}},U=new u,W=new c,pe=new c,G=new u,K=new u,q=new u,me=new c,he=new d,J=new ne,ge=new c,Y=new m,X=new l,Z=new u,Q,$;function _e(e,t,n){return Z.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),Z.multiplyScalar(1/Z.w),Z.x=$/n.width,Z.y=$/n.height,Z.applyMatrix4(e.projectionMatrixInverse),Z.multiplyScalar(1/Z.w),Math.abs(Math.max(Z.x,Z.y))}function ve(e,t){let n=e.matrixWorld,r=e.geometry,i=r.attributes.instanceStart,a=r.attributes.instanceEnd,o=Math.min(r.instanceCount,i.count);for(let r=0,s=o;r<s;r++){J.start.fromBufferAttribute(i,r),J.end.fromBufferAttribute(a,r),J.applyMatrix4(n);let o=new c,s=new c;Q.distanceSqToSegment(J.start,J.end,s,o),s.distanceTo(o)<$*.5&&t.push({point:s,pointOnLine:o,distance:Q.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[L]:null})}}function ye(e,t,n){let r=t.projectionMatrix,i=e.material.resolution,a=e.matrixWorld,o=e.geometry,s=o.attributes.instanceStart,l=o.attributes.instanceEnd,u=Math.min(o.instanceCount,s.count),d=-t.near;Q.at(1,q),q.w=1,q.applyMatrix4(t.matrixWorldInverse),q.applyMatrix4(r),q.multiplyScalar(1/q.w),q.x*=i.x/2,q.y*=i.y/2,q.z=0,me.copy(q),he.multiplyMatrices(t.matrixWorldInverse,a);for(let t=0,o=u;t<o;t++){if(G.fromBufferAttribute(s,t),K.fromBufferAttribute(l,t),G.w=1,K.w=1,G.applyMatrix4(he),K.applyMatrix4(he),G.z>d&&K.z>d)continue;if(G.z>d){let e=G.z-K.z,t=(G.z-d)/e;G.lerp(K,t)}else if(K.z>d){let e=K.z-G.z,t=(K.z-d)/e;K.lerp(G,t)}G.applyMatrix4(r),K.applyMatrix4(r),G.multiplyScalar(1/G.w),K.multiplyScalar(1/K.w),G.x*=i.x/2,G.y*=i.y/2,K.x*=i.x/2,K.y*=i.y/2,J.start.copy(G),J.start.z=0,J.end.copy(K),J.end.z=0;let o=J.closestPointToPointParameter(me,!0);J.at(o,ge);let u=T.lerp(G.z,K.z,o),f=u>=-1&&u<=1,p=me.distanceTo(ge)<$*.5;if(f&&p){J.start.fromBufferAttribute(s,t),J.end.fromBufferAttribute(l,t),J.start.applyMatrix4(a),J.end.applyMatrix4(a);let r=new c,i=new c;Q.distanceSqToSegment(J.start,J.end,i,r),n.push({point:i,pointOnLine:r,distance:Q.origin.distanceTo(i),object:e,face:null,faceIndex:t,uv:null,[L]:null})}}}var be=class extends i{constructor(e=new B,t=new H({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type=`LineSegments2`}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,a=t.count;e<a;e++,i+=2)W.fromBufferAttribute(t,e),pe.fromBufferAttribute(n,e),r[i]=i===0?0:r[i-1],r[i+1]=r[i]+W.distanceTo(pe);let i=new _(r,2,1);return e.setAttribute(`instanceDistanceStart`,new p(i,1,0)),e.setAttribute(`instanceDistanceEnd`,new p(i,1,1)),this}raycast(e,t){let n=this.material.worldUnits,r=e.camera;r===null&&!n&&console.error(`LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.`);let i=e.params.Line2===void 0?0:e.params.Line2.threshold||0;Q=e.ray;let a=this.matrixWorld,o=this.geometry,s=this.material;$=s.linewidth+i,o.boundingSphere===null&&o.computeBoundingSphere(),X.copy(o.boundingSphere).applyMatrix4(a);let c;if(c=n?$*.5:_e(r,Math.max(r.near,X.distanceToPoint(Q.origin)),s.resolution),X.radius+=c,Q.intersectsSphere(X)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),Y.copy(o.boundingBox).applyMatrix4(a);let l;l=n?$*.5:_e(r,Math.max(r.near,Y.distanceToPoint(Q.origin)),s.resolution),Y.expandByScalar(l),Q.intersectsBox(Y)!==!1&&(n?ve(this,t):ye(this,r,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(U),this.material.uniforms.resolution.value.set(U.z,U.w))}},xe=class extends be{constructor(e=new V,t=new H({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type=`Line2`}},Se=k.forwardRef(function({points:e,color:t=16777215,vertexColors:n,linewidth:r,lineWidth:i,segments:a,dashed:o,...l},d){var f;let p=C(e=>e.size),m=k.useMemo(()=>a?new be:new xe,[a]),[h]=k.useState(()=>new H),g=(n==null||(f=n[0])==null?void 0:f.length)===4?4:3,_=k.useMemo(()=>{let r=a?new B:new V,i=e.map(e=>{let t=Array.isArray(e);return e instanceof c||e instanceof u?[e.x,e.y,e.z]:e instanceof s?[e.x,e.y,0]:t&&e.length===3?[e[0],e[1],e[2]]:t&&e.length===2?[e[0],e[1],0]:e});if(r.setPositions(i.flat()),n){t=16777215;let e=n.map(e=>e instanceof b?e.toArray():e);r.setColors(e.flat(),g)}return r},[e,a,n,g]);return k.useLayoutEffect(()=>{m.computeLineDistances()},[e,m]),k.useLayoutEffect(()=>{o?h.defines.USE_DASH=``:delete h.defines.USE_DASH,h.needsUpdate=!0},[o,h]),k.useEffect(()=>()=>{_.dispose(),h.dispose()},[_]),k.createElement(`primitive`,O({object:m,ref:d},l),k.createElement(`primitive`,{object:_,attach:`geometry`}),k.createElement(`primitive`,O({object:h,attach:`material`,color:t,vertexColors:!!n,resolution:[p.width,p.height],linewidth:r??i??1,dashed:o,transparent:g===4},l)))}),Ce=k.forwardRef(({threshold:e=15,geometry:t,...n},r)=>{let i=k.useRef(null);k.useImperativeHandle(r,()=>i.current,[]);let a=k.useMemo(()=>[0,0,0,1,0,0],[]),o=k.useRef(null),s=k.useRef(null);return k.useLayoutEffect(()=>{let n=i.current.parent,r=t??n?.geometry;if(!r||o.current===r&&s.current===e)return;o.current=r,s.current=e;let a=new h(r,e).attributes.position.array;i.current.geometry.setPositions(a),i.current.geometry.attributes.instanceStart.needsUpdate=!0,i.current.geometry.attributes.instanceEnd.needsUpdate=!0,i.current.computeLineDistances()}),k.createElement(Se,O({segments:!0,points:a,ref:i,raycast:()=>null},n))});function we(e,t,n){let r=C(e=>e.size),i=C(e=>e.viewport),a=typeof e==`number`?e:r.width*i.dpr,o=typeof t==`number`?t:r.height*i.dpr,s=(typeof e==`number`?n:e)||{},{samples:c=0,depth:l,...u}=s,d=l??s.depthBuffer,f=k.useMemo(()=>{let e=new D(a,o,{minFilter:E,magFilter:E,type:x,...u});return d&&(e.depthTexture=new w(a,o,S)),e.samples=c,e},[]);return k.useLayoutEffect(()=>{f.setSize(a,o),c&&(f.samples=c)},[c,f,a,o]),k.useEffect(()=>()=>f.dispose(),[]),f}var Te=e=>typeof e==`function`,Ee=k.forwardRef(({envMap:e,resolution:t=256,frames:n=1/0,children:r,makeDefault:i,...a},o)=>{let s=C(({set:e})=>e),c=C(({camera:e})=>e),l=C(({size:e})=>e),u=k.useRef(null);k.useImperativeHandle(o,()=>u.current,[]);let d=k.useRef(null),f=we(t);k.useLayoutEffect(()=>{a.manual||u.current.updateProjectionMatrix()},[l,a]),k.useLayoutEffect(()=>{u.current.updateProjectionMatrix()}),k.useLayoutEffect(()=>{if(i){let e=c;return s(()=>({camera:u.current})),()=>s(()=>({camera:e}))}},[u,i,s]);let p=0,m=null,h=Te(r);return te(t=>{h&&(n===1/0||p<n)&&(d.current.visible=!1,t.gl.setRenderTarget(f),m=t.scene.background,e&&(t.scene.background=e),t.gl.render(t.scene,u.current),t.scene.background=m,t.gl.setRenderTarget(null),d.current.visible=!0,p++)}),k.createElement(k.Fragment,null,k.createElement(`orthographicCamera`,O({left:l.width/-2,right:l.width/2,top:l.height/2,bottom:l.height/-2,ref:u},a),!h&&r),k.createElement(`group`,{ref:d},h&&r(f.texture)))});export{O as i,Ce as n,F as r,Ee as t};