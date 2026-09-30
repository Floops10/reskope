import{a as e,n as t}from"./jsx-runtime-n5LQ9ujS.js";import{M as n}from"./index-CXLYUDtm.js";import{B as r,C as i,D as a,I as o,L as s,M as c,N as l,O as u,R as d,T as f,V as p,_ as m,a as h,b as g,c as _,d as v,f as y,g as ee,h as te,i as ne,l as b,m as re,o as x,p as ie,s as S,t as C,v as w,w as T,x as ae,y as E,z as D}from"./palette3d-BWxIqx9V.js";function O(){return O=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},O.apply(null,arguments)}var k=e(t()),oe=e(n()),A=new d,j=new d,M=new d,N=new s;function se(e,t,n){let r=A.setFromMatrixPosition(e.matrixWorld);r.project(t);let i=n.width/2,a=n.height/2;return[r.x*i+i,-(r.y*a)+a]}function ce(e,t){let n=A.setFromMatrixPosition(e.matrixWorld),r=j.setFromMatrixPosition(t.matrixWorld),i=n.sub(r),a=t.getWorldDirection(M);return i.angleTo(a)>Math.PI/2}function le(e,t,n,r){let i=A.setFromMatrixPosition(e.matrixWorld),a=i.clone();a.project(t),N.set(a.x,a.y),n.setFromCamera(N,t);let o=n.intersectObjects(r,!0);if(o.length){let e=o[0].distance;return i.distanceTo(n.ray.origin)<e}return!0}function ue(e,t){if(t instanceof a)return t.zoom;if(t instanceof u){let n=A.setFromMatrixPosition(e.matrixWorld),r=j.setFromMatrixPosition(t.matrixWorld),i=t.fov*Math.PI/180,a=n.distanceTo(r);return 1/(2*Math.tan(i/2)*a)}else return 1}function de(e,t,n){if(t instanceof u||t instanceof a){let r=A.setFromMatrixPosition(e.matrixWorld),i=j.setFromMatrixPosition(t.matrixWorld),a=r.distanceTo(i),o=(n[1]-n[0])/(t.far-t.near),s=n[1]-o*t.far;return Math.round(o*a+s)}}var fe=e=>Math.abs(e)<1e-10?0:e;function P(e,t,n=``){let r=`matrix3d(`;for(let n=0;n!==16;n++)r+=fe(t[n]*e.elements[n])+(n===15?`)`:`,`);return n+r}var pe=(e=>t=>P(t,e))([1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1]),me=(e=>(t,n)=>P(t,e(n),`translate(-50%,-50%)`))(e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1]);function he(e){return e&&typeof e==`object`&&`current`in e}var F=k.forwardRef(({children:e,eps:t=.001,style:n,className:r,prepend:i,center:a,fullscreen:o,portal:s,distanceFactor:c,sprite:l=!1,transform:u=!1,occlude:f,onOcclude:p,castShadow:m,receiveShadow:g,material:_,geometry:v,zIndexRange:y=[16777271,0],calculatePosition:ee=se,as:te=`div`,wrapperClass:b,pointerEvents:re=`auto`,...x},ie)=>{let{gl:S,camera:C,scene:w,size:T,raycaster:ae,events:E,viewport:D}=h(),[A]=k.useState(()=>document.createElement(te)),j=k.useRef(null),M=k.useRef(null),N=k.useRef(0),P=k.useRef([0,0]),F=k.useRef(null),I=k.useRef(null),L=s?.current||E.connected||S.domElement.parentNode,R=k.useRef(null),z=k.useRef(!1),B=k.useMemo(()=>f&&f!==`blending`||Array.isArray(f)&&f.length&&he(f[0]),[f]);k.useLayoutEffect(()=>{let e=S.domElement;f&&f===`blending`?(e.style.zIndex=`${Math.floor(y[0]/2)}`,e.style.position=`absolute`,e.style.pointerEvents=`none`):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[f]),k.useLayoutEffect(()=>{if(M.current){let e=j.current=oe.createRoot(A);if(w.updateMatrixWorld(),u)A.style.cssText=`position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;`;else{let e=ee(M.current,C,T);A.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return L&&(i?L.prepend(A):L.appendChild(A)),()=>{L&&L.removeChild(A),e.unmount()}}},[L,u]),k.useLayoutEffect(()=>{b&&(A.className=b)},[b]);let V=k.useMemo(()=>u?{position:`absolute`,top:0,left:0,width:T.width,height:T.height,transformStyle:`preserve-3d`,pointerEvents:`none`}:{position:`absolute`,transform:a?`translate3d(-50%,-50%,0)`:`none`,...o&&{top:-T.height/2,left:-T.width/2,width:T.width,height:T.height},...n},[n,a,o,T,u]),H=k.useMemo(()=>({position:`absolute`,pointerEvents:re}),[re]);k.useLayoutEffect(()=>{if(z.current=!1,u){var t;(t=j.current)==null||t.render(k.createElement(`div`,{ref:F,style:V},k.createElement(`div`,{ref:I,style:H},k.createElement(`div`,{ref:ie,className:r,style:n,children:e}))))}else{var i;(i=j.current)==null||i.render(k.createElement(`div`,{ref:ie,style:V,className:r,children:e}))}});let U=k.useRef(!0);ne(e=>{if(M.current){C.updateMatrixWorld(),M.current.updateWorldMatrix(!0,!1);let e=u?P.current:ee(M.current,C,T);if(u||Math.abs(N.current-C.zoom)>t||Math.abs(P.current[0]-e[0])>t||Math.abs(P.current[1]-e[1])>t){let t=ce(M.current,C),n=!1;B&&(Array.isArray(f)?n=f.map(e=>e.current):f!==`blending`&&(n=[w]));let r=U.current;n?U.current=le(M.current,C,ae,n)&&!t:U.current=!t,r!==U.current&&(p?p(!U.current):A.style.display=U.current?`block`:`none`);let i=Math.floor(y[0]/2),a=f?B?[y[0],i]:[i-1,0]:y;if(A.style.zIndex=`${de(M.current,C,a)}`,u){let[e,t]=[T.width/2,T.height/2],n=C.projectionMatrix.elements[5]*t,{isOrthographicCamera:r,top:i,left:a,bottom:o,right:s}=C,u=pe(C.matrixWorldInverse),d=r?`scale(${n})translate(${fe(-(s+a)/2)}px,${fe((i+o)/2)}px)`:`translateZ(${n}px)`,f=M.current.matrixWorld;l&&(f=C.matrixWorldInverse.clone().transpose().copyPosition(f).scale(M.current.scale),f.elements[3]=f.elements[7]=f.elements[11]=0,f.elements[15]=1),A.style.width=T.width+`px`,A.style.height=T.height+`px`,A.style.perspective=r?``:`${n}px`,F.current&&I.current&&(F.current.style.transform=`${d}${u}translate(${e}px,${t}px)`,I.current.style.transform=me(f,1/((c||10)/400)))}else{let t=c===void 0?1:ue(M.current,C)*c;A.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}P.current=e,N.current=C.zoom}}if(!B&&R.current&&!z.current)if(u){if(F.current){let e=F.current.children[0];if(e!=null&&e.clientWidth&&e!=null&&e.clientHeight){let{isOrthographicCamera:t}=C;if(t||v)x.scale&&(Array.isArray(x.scale)?x.scale instanceof d?R.current.scale.copy(x.scale.clone().divideScalar(1)):R.current.scale.set(1/x.scale[0],1/x.scale[1],1/x.scale[2]):R.current.scale.setScalar(1/x.scale));else{let t=(c||10)/400,n=e.clientWidth*t,r=e.clientHeight*t;R.current.scale.set(n,r,1)}z.current=!0}}}else{let t=A.children[0];if(t!=null&&t.clientWidth&&t!=null&&t.clientHeight){let e=1/D.factor,n=t.clientWidth*e,r=t.clientHeight*e;R.current.scale.set(n,r,1),z.current=!0}R.current.lookAt(e.camera.position)}});let W=k.useMemo(()=>({vertexShader:u?void 0:`
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
      `}),[u]);return k.createElement(`group`,O({},x,{ref:M}),f&&!B&&k.createElement(`mesh`,{castShadow:m,receiveShadow:g,ref:R},v||k.createElement(`planeGeometry`,null),_||k.createElement(`shaderMaterial`,{side:2,vertexShader:W.vertexShader,fragmentShader:W.fragmentShader})))}),I=parseInt(`185`.replace(/\D+/g,``)),L=I>=125?`uv1`:`uv2`,R=new S,z=new d,B=class extends m{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type=`LineSegmentsGeometry`,this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute(`position`,new re([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute(`uv`,new re([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new w(t,6,1);return this.setAttribute(`instanceStart`,new E(n,3,0)),this.setAttribute(`instanceEnd`,new E(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let r=new w(n,t*2,1);return this.setAttribute(`instanceColorStart`,new E(r,t,0)),this.setAttribute(`instanceColorEnd`,new E(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new p(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new S);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),R.setFromBufferAttribute(t),this.boundingBox.union(R))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new l),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)z.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(z)),z.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(z));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.`,this)}}toJSON(){}applyMatrix(e){return console.warn(`THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().`),this.applyMatrix4(e)}},V=class extends B{constructor(){super(),this.isLineGeometry=!0,this.type=`LineGeometry`}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,r=new Float32Array(2*n);if(t===3)for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];else for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5],r[2*i+6]=e[i+6],r[2*i+7]=e[i+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}},H=class extends c{constructor(e){super({type:`LineMaterial`,uniforms:o.clone(o.merge([x.common,x.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new s(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA=`1`:delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return`WORLD_UNITS`in this.defines},set:function(e){e===!0?this.defines.WORLD_UNITS=``:delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return`USE_DASH`in this.defines},set(e){!!e!=`USE_DASH`in this.defines&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH=``:delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return`USE_ALPHA_TO_COVERAGE`in this.defines},set:function(e){!!e!=`USE_ALPHA_TO_COVERAGE`in this.defines&&(this.needsUpdate=!0),e===!0?(this.defines.USE_ALPHA_TO_COVERAGE=``,this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}},U=new D,W=new d,ge=new d,G=new D,K=new D,q=new D,_e=new d,ve=new T,J=new g,ye=new d,Y=new S,X=new l,Z=new D,Q,$;function be(e,t,n){return Z.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),Z.multiplyScalar(1/Z.w),Z.x=$/n.width,Z.y=$/n.height,Z.applyMatrix4(e.projectionMatrixInverse),Z.multiplyScalar(1/Z.w),Math.abs(Math.max(Z.x,Z.y))}function xe(e,t){let n=e.matrixWorld,r=e.geometry,i=r.attributes.instanceStart,a=r.attributes.instanceEnd,o=Math.min(r.instanceCount,i.count);for(let r=0,s=o;r<s;r++){J.start.fromBufferAttribute(i,r),J.end.fromBufferAttribute(a,r),J.applyMatrix4(n);let o=new d,s=new d;Q.distanceSqToSegment(J.start,J.end,s,o),s.distanceTo(o)<$*.5&&t.push({point:s,pointOnLine:o,distance:Q.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[L]:null})}}function Se(e,t,n){let r=t.projectionMatrix,a=e.material.resolution,o=e.matrixWorld,s=e.geometry,c=s.attributes.instanceStart,l=s.attributes.instanceEnd,u=Math.min(s.instanceCount,c.count),f=-t.near;Q.at(1,q),q.w=1,q.applyMatrix4(t.matrixWorldInverse),q.applyMatrix4(r),q.multiplyScalar(1/q.w),q.x*=a.x/2,q.y*=a.y/2,q.z=0,_e.copy(q),ve.multiplyMatrices(t.matrixWorldInverse,o);for(let t=0,s=u;t<s;t++){if(G.fromBufferAttribute(c,t),K.fromBufferAttribute(l,t),G.w=1,K.w=1,G.applyMatrix4(ve),K.applyMatrix4(ve),G.z>f&&K.z>f)continue;if(G.z>f){let e=G.z-K.z,t=(G.z-f)/e;G.lerp(K,t)}else if(K.z>f){let e=K.z-G.z,t=(K.z-f)/e;K.lerp(G,t)}G.applyMatrix4(r),K.applyMatrix4(r),G.multiplyScalar(1/G.w),K.multiplyScalar(1/K.w),G.x*=a.x/2,G.y*=a.y/2,K.x*=a.x/2,K.y*=a.y/2,J.start.copy(G),J.start.z=0,J.end.copy(K),J.end.z=0;let s=J.closestPointToPointParameter(_e,!0);J.at(s,ye);let u=i.lerp(G.z,K.z,s),p=u>=-1&&u<=1,m=_e.distanceTo(ye)<$*.5;if(p&&m){J.start.fromBufferAttribute(c,t),J.end.fromBufferAttribute(l,t),J.start.applyMatrix4(o),J.end.applyMatrix4(o);let r=new d,i=new d;Q.distanceSqToSegment(J.start,J.end,i,r),n.push({point:i,pointOnLine:r,distance:Q.origin.distanceTo(i),object:e,face:null,faceIndex:t,uv:null,[L]:null})}}}var Ce=class extends f{constructor(e=new B,t=new H({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type=`LineSegments2`}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,a=t.count;e<a;e++,i+=2)W.fromBufferAttribute(t,e),ge.fromBufferAttribute(n,e),r[i]=i===0?0:r[i-1],r[i+1]=r[i]+W.distanceTo(ge);let i=new w(r,2,1);return e.setAttribute(`instanceDistanceStart`,new E(i,1,0)),e.setAttribute(`instanceDistanceEnd`,new E(i,1,1)),this}raycast(e,t){let n=this.material.worldUnits,r=e.camera;r===null&&!n&&console.error(`LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.`);let i=e.params.Line2===void 0?0:e.params.Line2.threshold||0;Q=e.ray;let a=this.matrixWorld,o=this.geometry,s=this.material;$=s.linewidth+i,o.boundingSphere===null&&o.computeBoundingSphere(),X.copy(o.boundingSphere).applyMatrix4(a);let c;if(c=n?$*.5:be(r,Math.max(r.near,X.distanceToPoint(Q.origin)),s.resolution),X.radius+=c,Q.intersectsSphere(X)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),Y.copy(o.boundingBox).applyMatrix4(a);let l;l=n?$*.5:be(r,Math.max(r.near,Y.distanceToPoint(Q.origin)),s.resolution),Y.expandByScalar(l),Q.intersectsBox(Y)!==!1&&(n?xe(this,t):Se(this,r,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(U),this.material.uniforms.resolution.value.set(U.z,U.w))}},we=class extends Ce{constructor(e=new V,t=new H({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type=`Line2`}},Te=k.forwardRef(function({points:e,color:t=16777215,vertexColors:n,linewidth:r,lineWidth:i,segments:a,dashed:o,...c},l){var u;let f=h(e=>e.size),p=k.useMemo(()=>a?new Ce:new we,[a]),[m]=k.useState(()=>new H),g=(n==null||(u=n[0])==null?void 0:u.length)===4?4:3,_=k.useMemo(()=>{let r=a?new B:new V,i=e.map(e=>{let t=Array.isArray(e);return e instanceof d||e instanceof D?[e.x,e.y,e.z]:e instanceof s?[e.x,e.y,0]:t&&e.length===3?[e[0],e[1],e[2]]:t&&e.length===2?[e[0],e[1],0]:e});if(r.setPositions(i.flat()),n){t=16777215;let e=n.map(e=>e instanceof v?e.toArray():e);r.setColors(e.flat(),g)}return r},[e,a,n,g]);return k.useLayoutEffect(()=>{p.computeLineDistances()},[e,p]),k.useLayoutEffect(()=>{o?m.defines.USE_DASH=``:delete m.defines.USE_DASH,m.needsUpdate=!0},[o,m]),k.useEffect(()=>()=>{_.dispose(),m.dispose()},[_]),k.createElement(`primitive`,O({object:p,ref:l},c),k.createElement(`primitive`,{object:_,attach:`geometry`}),k.createElement(`primitive`,O({object:m,attach:`material`,color:t,vertexColors:!!n,resolution:[f.width,f.height],linewidth:r??i??1,dashed:o,transparent:g===4},c)))}),Ee=k.forwardRef(({threshold:e=15,geometry:t,...n},r)=>{let i=k.useRef(null);k.useImperativeHandle(r,()=>i.current,[]);let a=k.useMemo(()=>[0,0,0,1,0,0],[]),o=k.useRef(null),s=k.useRef(null);return k.useLayoutEffect(()=>{let n=i.current.parent,r=t??n?.geometry;if(!r||o.current===r&&s.current===e)return;o.current=r,s.current=e;let a=new ie(r,e).attributes.position.array;i.current.geometry.setPositions(a),i.current.geometry.attributes.instanceStart.needsUpdate=!0,i.current.geometry.attributes.instanceEnd.needsUpdate=!0,i.current.computeLineDistances()}),k.createElement(Te,O({segments:!0,points:a,ref:i,raycast:()=>null},n))});function De(e,t,n){let i=h(e=>e.size),a=h(e=>e.viewport),o=typeof e==`number`?e:i.width*a.dpr,s=typeof t==`number`?t:i.height*a.dpr,c=(typeof e==`number`?n:e)||{},{samples:l=0,depth:u,...d}=c,f=u??c.depthBuffer,p=k.useMemo(()=>{let e=new r(o,s,{minFilter:ae,magFilter:ae,type:ee,...d});return f&&(e.depthTexture=new y(o,s,te)),e.samples=l,e},[]);return k.useLayoutEffect(()=>{p.setSize(o,s),l&&(p.samples=l)},[l,p,o,s]),k.useEffect(()=>()=>p.dispose(),[]),p}var Oe=e=>typeof e==`function`,ke=k.forwardRef(({envMap:e,resolution:t=256,frames:n=1/0,children:r,makeDefault:i,...a},o)=>{let s=h(({set:e})=>e),c=h(({camera:e})=>e),l=h(({size:e})=>e),u=k.useRef(null);k.useImperativeHandle(o,()=>u.current,[]);let d=k.useRef(null),f=De(t);k.useLayoutEffect(()=>{a.manual||u.current.updateProjectionMatrix()},[l,a]),k.useLayoutEffect(()=>{u.current.updateProjectionMatrix()}),k.useLayoutEffect(()=>{if(i){let e=c;return s(()=>({camera:u.current})),()=>s(()=>({camera:e}))}},[u,i,s]);let p=0,m=null,g=Oe(r);return ne(t=>{g&&(n===1/0||p<n)&&(d.current.visible=!1,t.gl.setRenderTarget(f),m=t.scene.background,e&&(t.scene.background=e),t.gl.render(t.scene,u.current),t.scene.background=m,t.gl.setRenderTarget(null),d.current.visible=!0,p++)}),k.createElement(k.Fragment,null,k.createElement(`orthographicCamera`,O({left:l.width/-2,right:l.width/2,top:l.height/2,bottom:l.height/-2,ref:u},a),!g&&r),k.createElement(`group`,{ref:d},g&&r(f.texture)))});function Ae(e=`plein`,t=C()){let n=new _(1,1,1),[r,i,a]=t[e]||t.plein,o=[i,a,r,a,i,a].map(e=>new v(e)),s=new Float32Array(n.attributes.position.count*3);for(let e=0;e<6;e++)for(let t=0;t<4;t++){let n=e*4+t;s[n*3]=o[e].r,s[n*3+1]=o[e].g,s[n*3+2]=o[e].b}return n.setAttribute(`color`,new b(s,3)),n}function je(e,t=1){let n=Math.sin(e*127.1+t*311.7)*43758.5453;return n-Math.floor(n)}export{F as a,Ee as i,je as n,O as o,ke as r,Ae as t};