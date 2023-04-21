assets["gem_shaders/gem.vert"]=`precision mediump float;
attribute vec4 a_pos;
attribute vec4 a_norm;
uniform mat4 u_pvmMat;
uniform mat4 u_mMat_inv;
uniform mat4 u_mMat_cen;
varying vec3 v_pos;
varying vec3 v_pos_orig;
varying vec3 v_norm;
varying mat4 v_mMat;
varying mat4 v_mMat_inv;

void main() {
    gl_Position = u_pvmMat * (a_pos);
    v_mMat = u_mMat_cen;
    v_norm = normalize((v_mMat * a_norm).xyz);
    v_pos = (v_mMat * a_pos).xyz;
    v_pos_orig = a_pos.xyz;
    v_mMat_inv = u_mMat_inv;
}`
assets["gem_shaders/get_normal_ROSE.glsl"]=`

#define cubeShape vec3(0.9494, 1.09627, 0.45438)

#define SQ vec3(0.9494, 1.09627, 0.45438)

#define BLOCK_ENTRY 1.0



vec3 get_normal(vec3 dir){
    float x = abs(dir.x);
    float y = abs(dir.y);
    float z = abs(dir.z);

    if( z > 1.01*SQ.z ) {
        return vec3(0.0);
    }

    float x_max = float(x*SQ.y*SQ.z > y*SQ.x*SQ.z) * float(x*SQ.y*SQ.z > z*SQ.x*SQ.y);
    float y_max = float(y*SQ.x*SQ.z > z*SQ.x*SQ.y) * (1.0 - x_max);
    float z_max = (1.0 - y_max) * (1.0 - x_max);

    float up_right_seg0 = float(y > -1.73205 * x + 1.1547);
    float up_right_seg1 = 1.0 - up_right_seg0;
    float up_left_seg0 = float(y > 1.73205 * x);
    float up_left_seg1 = (1.0 - up_left_seg0) * float(y > 1.73205 * x - 1.1547);
    float up_left_seg2 = (1.0 - up_left_seg0) * (1.0 - up_left_seg1);
    float upper_seg0 = float(y > 0.5*1.1547);
    float upper_seg1 = 1.0 - upper_seg0;

    vec3 rtn = vec3(0.0);
    rtn = rtn + upper_seg0 * up_right_seg1 * vec3(0.0, 0.83516, 0.55);
    rtn = rtn + up_right_seg0 * upper_seg1 * up_left_seg1 * vec3(0.72327, 0.41758, 0.55);
    rtn = rtn + up_right_seg1 * up_left_seg1 * vec3(0.51962, 0.3, 0.8);
    rtn = rtn + up_right_seg1 * up_left_seg0 * upper_seg1 * vec3(0.0, 0.6, 0.8);



    float remainder0 = up_right_seg0 * up_left_seg0;
    rtn = rtn + remainder0 * vec3(0.35759, 0.91221, 0.2);
    float remainder1 = up_left_seg1 * up_right_seg0 * upper_seg0;
    rtn = rtn + remainder1 * vec3(0.6112, 0.76579, 0.2);
    float remainder2 = up_left_seg2;
    rtn = rtn + remainder2 * vec3(0.96879, 0.14642, 0.2);
    rtn = rtn * vec3(x/dir.x, y/dir.y, z/dir.z) + (1.0-z_max) * (1.0 - remainder0) * (1.0 - remainder1) * (1.0 - remainder2) * vec3(x_max*x/dir.x, y_max*y/dir.y, 0.0);



    return rtn ;

}`
assets["gem_shaders/get_normal_HEART.glsl"]=`#define cubeShape vec3(0.85708, 0.74273, 0.2525)
#define SQ vec3(0.85708, 0.74273, 0.2525)
#define BLOCK_ENTRY 1.0

vec3 get_normal(vec3 dir){
    float x = abs(dir.x);
    float y = dir.y;
    float z = abs(dir.z);
    float z_max = float(z*SQ.x*SQ.y > x*SQ.y*SQ.z) * float(z*SQ.x*SQ.y > abs(y)*SQ.x*SQ.z);
    float x_max = (1.0 - z_max) * float(x*SQ.y*SQ.z > abs(y)*SQ.x*SQ.z);
    float y_max = (1.0 - x_max) * (1.0 - z_max);
    float z_max_x_max = float(x*SQ.y > abs(y)*SQ.x);
    float z_max_y_max = 1.0 - z_max_x_max;
    float x_sign = dir.x/x;
    float y_sign = dir.y/abs(y);
    float z_sign = dir.z/z;

    float center = float(y<x*0.55077+0.32)*float(y<x*-0.35107+0.57298)*float(y>x*3.42191+-1.43794)*float(y>x*1.37245+-0.49417)*float(y>x*0.59348+-0.29495);
    float seg10 = float(y < x*-0.1622 + 0.52) * float(x < 0.28052) * float(y > 0.0);
    float seg11 = float(y > 0.38587) * float(y < x*0.29905 + 0.39061) * float(x > 0.28052) * float(x < 0.53298);
    float seg12 = float(y < x + 0.38587 - 0.53298) * float(y < x*-1.3315 + 1.09553) * float(y > x*0.82857 + -0.24371);
    float seg13 = float(y > x*0.21088 + -0.19711) * float(x < 0.4605) * float(y < 0.13784);
    float seg14 = float(y > max(1.63208*x + -0.56057, -1.68807*x + -0.29495)) * float(y < 0.0);

    float seg1x = (1.0 - center) * (seg10 + seg11 + seg12 + seg13 + seg14);
    vec3 seg1_norm = seg10 * vec3(-0.12721, 0.43786, 0.89);
    seg1_norm = seg1_norm + seg11 * vec3(0.10644, 0.44336, 0.89);
    seg1_norm = seg1_norm + seg12 * vec3(0.45368, -0.04552, 0.89);
    seg1_norm = seg1_norm + seg13 * vec3(0.41997, -0.17756, 0.89);
    seg1_norm = seg1_norm + seg14 * vec3(0.40014, -0.2186, 0.89);

    float seg20 = float(y > 0.32) * float(y < min(-0.7*x + 0.7*0.53298 + 0.55, 0.7*x + 0.52)) * float(x < 0.53298);
    float seg21 = float(x > 0.53298) * float(y > 0.27) * float(y > 1.3*x + -0.536) * float(y < 0.55);
    float seg22 = float(y > -0.1) * float(y < 0.27) * float(y < -2.07692*x + 1.55769) * float(y > 0.34542*x + -0.25906);
    float seg23 = float(x > 0.08) * float(y < -0.1) * float(y < -4.01998*x + 1.75119) * float(y > -0.14583*x + -0.41833);
    float seg24 = float(y < 0.0) * float(y > x*3.75 + -0.73);

    vec3 seg20_norm = vec3(0.0519, 0.6594, 0.75);
    vec3 seg21_norm = vec3(0.64825, 0.13141, 0.75);
    vec3 seg22_norm = vec3(0.60922, -0.25758, 0.75);
    vec3 seg23_norm = vec3(0.54591, -0.37348, 0.75);
    vec3 seg24_norm = vec3(.0, -0.66144, 0.75);

    float seg2x = (1.0 - center) * (1.0 - seg1x) * (seg20 + seg21 + seg22 + seg23 + seg24);
    vec3 seg2_norm = seg20 * seg20_norm + seg21 * seg21_norm + seg22 * seg22_norm + seg23 * seg23_norm + seg24 * seg24_norm;

    float edge = z_max * (1.0 - center) * (1.0 - seg1x) * (1.0 - seg2x);
    vec3 edge_norm = vec3(0.866*z_max_x_max, 0.866*z_max_y_max * y_sign, 0.5);

    float top = float(abs(dir.x) * 0.73 < dir.y) * 2.0 - 1.0;
    float right = 2.0*float(dir.x > 0.0) - 1.0;
    float cZ = 0.95;
    float cX = 0.3;
    float cNX = sqrt(1.0-cX*cX);
    vec3 rtn = edge*edge_norm + y_max*vec3(0.0, y_sign, 0.0) + x_max*vec3(1.0, 0.0, 0.0) + seg1x*seg1_norm + seg2x*seg2_norm + center * vec3(cX, cNX*top*sqrt(1.0-cZ*cZ), cNX*cZ);

    return rtn * vec3(x_sign, 1.0, z_sign);
}
`
assets["gem_shaders/get_normal_TRILLIANT.glsl"]=`
#define cubeShape vec3(0.97264, 0.84233, 0.38044)

#define SQ vec3(0.97264, 0.84233, 0.38044)

#define BLOCK_ENTRY 1.0



vec3 get_normal(vec3 dir){
    float top = float(dir.y > max(0.0, dir.x*1.7320508075688772));
    float bot = (1.0 - top) * float(dir.y < -dir.x*1.7320508075688772);
    float mid = (1.0 - top) * (1.0 - bot);
    float cos_th = mid - bot * 0.5 - top * 0.5;
    float sin_th0 = bot * 0.8660254037844386 - top * 0.8660254037844386;
    float sin_th1 = top * 0.8660254037844386 - bot * 0.8660254037844386;

    float ax = abs(dir.x);
    float ay = abs(dir.y);
    float az = abs(dir.z);
    float z_max = float(az*SQ.x*SQ.y > ax*SQ.y*SQ.z) * float(az*SQ.x*SQ.y > ay*SQ.x*SQ.z);
    float x = dir.x*cos_th - dir.y*sin_th0;
    float uy = dir.x*sin_th0 + dir.y*cos_th;
    float y = abs(uy);
    float z_pos = float(dir.z >= 0.0);
    float z_neg = 1.0 - z_pos;

    vec3 bmid_norm = vec3(0.50904, 0.70063, 0.5);
    vec3 bedge_norm = vec3(0.64698, 0.13752, 0.75);
    vec3 bside_norm = vec3(0.64721, 0.47023, 0.6);

    float bedge = float(y < x*-0.21445 + 0.20438);
    float bmid = (1.0-bedge)*float(y < min(x*0.17237 + 0.16377, x*-0.92438 + 0.88099));
    float bside = (1.0-bedge)*(1.0-bmid)*float(y < x*-0.75722 + 0.77167) * float(x < 0.65395);
    float back_face = z_neg*(bedge + bmid + bside);

    vec3 nrtn = vec3(0.0);
    nrtn = nrtn + bedge * bedge_norm + bmid * bmid_norm + bside*bside_norm + z_max*(1.0-back_face) * vec3(0.0, 0.0, -1.0);



    float center = float(y < x*-0.72419 + 0.40528);
    float seg1 = (1.0 - center) * float(y < x*-0.36265 + 0.34563);
    float seg1_right = seg1 * float(x > y*0.90909 + 0.55963);
    float seg1_left = seg1 * (1.0 - seg1_right);
    float seg2 = (1.0 - center) * (1.0 - seg1) * float(y < x*-1.23395 + 0.91823);
    float seg3 = (1.0 - center) * (1.0 - seg1) * (1.0 - seg2) * float(y < x*-0.83331 + 0.79419);
    float front_face = z_pos*(center + seg1 + seg2 + seg3);

    vec3 prtn = center*vec3(0.0, 0.0, 1.0);
    prtn = prtn + seg1_right*vec3(0.63804, 0.0, 0.77);
    prtn = prtn + seg1_left*vec3(0.4272, 0.0866, 0.9);
    prtn = prtn + seg2 * vec3(0.34172, 0.59188, 0.73);
    prtn = prtn + seg3 * vec3(0.78286, 0.16471, 0.6);
    prtn = prtn + z_max*(1.0 - front_face) * vec3(0.0, 0.0, 1.0);

    vec3 rtn = z_pos * prtn + z_neg * nrtn  + (1.0 - z_max)* vec3(0.8660254037844386, 0.5, 0.0);
    rtn.y = rtn.y * y/uy;
    return vec3(rtn.x*cos_th - rtn.y*sin_th1, rtn.x*sin_th1 + rtn.y*cos_th, rtn.z);

}`
assets["gem_shaders/consts_regular.glsl"]=`precision mediump float;
uniform samplerCube u_sampler;
uniform vec4 u_color[1];
uniform vec3 u_lights[3];
uniform vec4 u_env_d_mx[1]; // x -> ENV_D multiplier, xyz -> unused

varying vec3 v_pos;
varying vec3 v_pos_orig;
varying vec3 v_norm;
varying mat4 v_mMat;
varying mat4 v_mMat_inv;

#define CAM_LOC vec3(0.0, 0.0, 5.0)
#define ENV_D 15.5
#define NUMERICAL_THRESHOLD 0.0001
#define SUN_LOC vec3(0.457496, 0.457496, 0.762493)
#define BOUNCE_MAX 5
#define _x_COS_CRITICAL_ANGLE 0.4166
#define _x_REF_INDEX 1.1
#define _COS_CRITICAL_ANGLE 0.74536
#define _REF_INDEX 1.5
#define COS_CRITICAL_ANGLE 0.91
#define REF_INDEX 2.417
#define TAU 6.2831853
#define PI 3.14159265
#define GREYNESS 0.0
#define FLIP_NORMAL -1.0
`
assets["gem_shaders/get_normal_PRINCESS.glsl"]=`#define cubeShape vec3(0.7777, 0.7777, 0.37496)

#define SQ vec3(0.7777, 0.7777, 0.37496)

#define BLOCK_ENTRY 1.0



vec3 get_normal(vec3 dir){
    float _x = abs(dir.x);
    float _y = abs(dir.y);
    float _z = abs(dir.z);
    float z_max = float(_z*SQ.x*SQ.y > _x*SQ.y*SQ.z) * float(_z*SQ.x*SQ.y > _y*SQ.x*SQ.z);
    float x_max = (1.0 - z_max) * float(_x*SQ.y*SQ.z > _y*SQ.x*SQ.z);
    float y_max = (1.0 - x_max) * (1.0 - z_max);
    float z_pos = float(dir.z >= 0.0);
    float z_neg = 1.0 - z_pos;
    float x_sign = dir.x/_x;
    float y_sign = dir.y/_y;
    float z_sign = dir.z/_z;
    float xy_swap = float(_y > _x);
    float no_swap = 1.0 - xy_swap;
    float x = _x * no_swap + _y * xy_swap;
    float y = _y * no_swap + _x * xy_swap;

    float seg0 = float(y < x*-6.28571 + 3.20571);
    float edge = float(y > max(0.51724*x + 0.21241, 1.51852*x + -0.51852));
    float pocket = (1.0 - edge) * (1.0 - seg0) * float(y > 2.68182*x + -1.36773);
    float right = (1.0 - seg0) * (1.0 - edge) * (1.0 - pocket);
    float leftright = right * float(x > 0.73);
    float rightright = right * float(x <= 0.73);

    vec3 top = seg0*vec3(0.0, 0.0, 1.0);
    top = top + edge*vec3(0.56569, 0.56569, 0.6);
    top = top + pocket*vec3(0.62128, 0.07491, 0.78);
    top = top + leftright*vec3(0.71414, 0.0, 0.7);
    top = top + rightright*vec3(0.8, 0.0, 0.6);
    top = top;

    float _back0 = float(y > x*1.25 + -0.25);
    float _back1 = float(y > x*1.87512 + -0.87512);
    float _back2 = float(y > x*3.33333 + -2.33333);
    float _back3 = (1.0 - _back0) * (1.0 - _back1) * (1.0 - _back2);
    float back0 = _back0;
    float back1 = _back1 * (1.0 - _back0);
    float back2 = _back2 * (1.0 - _back1);
    float back3 = _back3 * (1.0 - _back2);
    vec3 bot = back0*vec3(0.37249, 0.37249, 0.85);
    bot = bot + back1 * vec3(0.56144, 0.40791, 0.72);
    bot = bot + back2 * vec3(0.72583, 0.36983, 0.58);
    bot = bot + back3 * vec3(0.86603, .0, 0.5);

    float side_seg0 = float(_z < 0.265);
    float side_seg1 = 1.0 - side_seg0;
    vec3 side_norm = vec3(side_seg0*0.99499 + side_seg1*0.95394, 0.0, z_sign*(side_seg0*0.1 + side_seg1*0.3));

    vec3 rtn = z_max * (z_pos * top + z_neg * bot) + (1.0 - z_max) * side_norm;
    vec3 final_rtn = vec3(x_sign*(rtn.x*no_swap + rtn.y*xy_swap), y_sign*(rtn.y*no_swap + rtn.x*xy_swap), rtn.z);
    return final_rtn;

}`
assets["gem_shaders/set_color_regular.glsl"]=`void set_color(vec3 model_pos, vec3 model_dir, float _distance, vec3 exit_norm){
  vec3 world_pos = (v_mMat*vec4(model_pos, 1.0)).xyz;
  vec3 world_dir = (v_mMat*vec4(model_dir, 0.0)).xyz;
  vec3 world_intersect = getCubeMapDirForEnv(world_pos/ENV_D, world_dir/ENV_D);

  float threshold = 0.89;
  float bounce2 = -reflect(u_lights[1], v_norm).z;
  float bounce3 = -reflect(u_lights[2], v_norm).z;
  float bm = max(bounce2, bounce3);
  bm = float(bm >= threshold) * (bm - threshold) / (1.0 - threshold);

  float r = textureCube(u_sampler, vec3(0.01 +world_intersect.x, 0.00 + world_intersect.y, 0.00 + world_intersect.z)).r;
  float g = textureCube(u_sampler, vec3(0.03 +world_intersect.x, 0.00 + world_intersect.y, 0.00 + world_intersect.z)).r;
  float b = textureCube(u_sampler, vec3(0.04 +world_intersect.x, 0.00 + world_intersect.y, 0.00 + world_intersect.z)).r;
  vec3 glassy = vec3(u_color[0].x*r, u_color[0].y*g, u_color[0].z*b);
  glassy = glassy + (vec3(1.0)-glassy) * bm;


  float solid = u_color[0].w;
  vec3 solidColor = bm + u_color[0].xyz * (0.3 + 0.7*dot(v_norm.xyz, SUN_LOC));
  gl_FragColor = vec4((1.0-solid)*glassy + solid*solidColor, 1.0);
}
`
assets["gem_shaders/get_normal_MARQUISE.glsl"]=`#define BIG_SIDE_NORMAL vec3(0.6, 0.0, 0.8)
#define FRONT_CORNER_NORMAL normalize(vec3(0.3, 0.15, 0.99))
#define TOP_NORMAL normalize(vec3(0.25, 0.25, 1.0))
#define TOP_SIDE_NORMAL normalize(vec3(0.5, 0.15, 0.8))
#define REMAINDER_NORMAL normalize(vec3(0.3, 0.2, 1.0))
#define SQ vec3(0.6, 1.0, 0.2)
#define BLOCK_ENTRY 1.0

vec3 get_normal(vec3 _dir){
    vec3 dir = (1.0/max(abs(_dir.x), max(abs(_dir.y), abs(_dir.z)))) * _dir;
    float x = abs(dir.x);
    float y = abs(dir.y);
    float z = abs(dir.z);
    vec3 quad = vec3(dir.x/x, dir.y/y, dir.z/z);

    float in_plane_second_z_or_not_in_plane = float(z <= 0.55) * float(x > 0.30590000000000006*6.666666666666666*(z - 0.4));
    float in_wedge = float(x + 0.135*y + 0.798*(1.0-z) <= 0.8);
    float in_plane = (1.0 - in_plane_second_z_or_not_in_plane)*in_wedge;
    float in_top = in_wedge * in_plane_second_z_or_not_in_plane;


    float in_big_side = (1.0 - in_plane)*float(y < min((0.35 + -1.625*(z-1.0))*(x*5.000000000000001 + -4.000000000000001), 1.6666666666666667 * z));

    float in_front_corner = (1.0 - in_big_side - in_plane + in_big_side*in_plane)*float(z > 0.072035729721942*x + 0.527964270278058);

    float in_top_side_triangle = (1.0-in_big_side)*float(z < x*1.9999999999999996 + -1.3999999999999997);

    vec3 rtn = (1.0 - in_plane - in_big_side - in_front_corner - in_top - in_top_side_triangle)*REMAINDER_NORMAL*quad;
    rtn = rtn + in_top_side_triangle*TOP_SIDE_NORMAL*quad;
    rtn = rtn + in_plane*vec3(0.0, 0.0, quad.z);
    rtn = rtn + in_big_side*BIG_SIDE_NORMAL*quad;
    rtn = rtn + in_front_corner*FRONT_CORNER_NORMAL*quad;
    rtn = rtn + in_top*TOP_NORMAL*quad;
    return rtn;
}`
assets["gem_shaders/get_normal_RECTANGLE.glsl"]=`#define cubeShape vec3(0.66173, 1.01, 0.22405)

#define SQ vec3(0.66173, 1.01, 0.22405)

#define BLOCK_ENTRY 1.0



vec3 get_normal(vec3 _dir){
    vec3 dir = _dir;//(1.0/max(abs(_dir.x), max(abs(_dir.y), abs(_dir.z)))) * _dir;
    float x = abs(dir.x);
    float y = abs(dir.y);
    float z = abs(dir.z);

    float center = float(x < .0)*float(y < min(-1.0*x+0.36, 0.36));
    float center0 = float(x < 0.215)*float(y < min(-1.0*x+0.68249, 0.575));
    float center1 = float(x < 0.43)*float(y < min(-1.0*x+1.00499, 0.79));
    float center2 = float(x < 0.645)*float(y < min(-1.0*x+1.32749, 1.005));
    float side = (1.0-center)*float(y < 0.5*x + 0.35999);
    float top = (1.0-center)*float(y > 2.0*x + 0.36002);
    float corner = (1.0 - center) * (1.0 - top) * (1.0 - side);
    vec2 xy = side*vec2(0.1, 0.0) + top*vec2(0.0, 0.1) + corner*vec2(0.07071, 0.07071);
    float new_z = center*0.7 + center0*0.1 + center1*0.1 + center2*0.1;

    return normalize(vec3(x/dir.x, y/dir.y, z/dir.z)*vec3(xy, new_z));

}`
assets["gem_shaders/other_funcs.glsl"]=`vec4 vector_plane_intersect(vec3 vp, vec3 vd, vec3 pp, vec3 pn){
  float vectorDotNormal = dot(vd, pn);
  float d = dot(pp - vp, pn) / vectorDotNormal;
  return vec4(vp + d * vd, d);
}

int get_current_side(vec3 p){
  float mx = abs(p.x);
  float my = abs(p.y);
  float mz = abs(p.z);
  int x_cross = int((mx*SQ.y*SQ.z > my*SQ.x*SQ.z) && (mx*SQ.y*SQ.z > mz*SQ.x*SQ.y));
  int y_cross = int(my*SQ.x*SQ.z > mz*SQ.x*SQ.y);
  int pos_x = 1 - int(p.x > 0.0);
  int pos_y = 3 - int(p.y > 0.0);
  int pos_z = 5 -  int(p.z > 0.0);
  return x_cross*pos_x + (1-x_cross)*(y_cross*pos_y + (1-y_cross)*pos_z);
}

vec4 update_rtn(vec3 p, vec3 d, vec3 side, vec3 norm, vec4 rtn){
  vec4 intersect = vector_plane_intersect(p, d, side, norm);
  if( (dot(d, side) > 0.0) && (intersect.w < rtn.w) ) {
    return intersect;
  }
  return rtn;
}

vec3 getCubeMapDirForEnv(vec3 p, vec3 d){
  vec4 rtn = vec4(1.0, 1.0, 1.0, u_env_d_mx[0].x*ENV_D);
  rtn = update_rtn(p, d, vec3(1.0, 0.0, 0.0), vec3(1.0, 0.0, 0.0), rtn);
  rtn = update_rtn(p, d, vec3(-1.0, 0.0, 0.0), vec3(-1.0, 0.0, 0.0), rtn);
  rtn = update_rtn(p, d, vec3(0.0, 1.0, 0.0), vec3(0.0, 1.0, 0.0), rtn);
  rtn = update_rtn(p, d, vec3(0.0, -1.0, 0.0), vec3(0.0, -1.0, 0.0), rtn);
  rtn = update_rtn(p, d, vec3(0.0, 0.0, 1.0), vec3(0.0, 0.0, 1.0), rtn);
  rtn = update_rtn(p, d, vec3(0.0, 0.0, -1.0), vec3(0.0, 0.0, -1.0), rtn);
  return rtn.xyz;
}

vec3 getCubeMapDirNoSkip(vec3 p, vec3 d){
  vec4 rtn = vec4(1.0, 1.0, 1.0, u_env_d_mx[0].x*ENV_D);
  rtn = update_rtn(p, d, SQ*vec3(1.0, 0.0, 0.0), vec3(1.0, 0.0, 0.0), rtn);
  rtn = update_rtn(p, d, SQ*vec3(-1.0, 0.0, 0.0), vec3(-1.0, 0.0, 0.0), rtn);
  rtn = update_rtn(p, d, SQ*vec3(0.0, 1.0, 0.0), vec3(0.0, 1.0, 0.0), rtn);
  rtn = update_rtn(p, d, SQ*vec3(0.0, -1.0, 0.0), vec3(0.0, -1.0, 0.0), rtn);
  rtn = update_rtn(p, d, SQ*vec3(0.0, 0.0, 1.0), vec3(0.0, 0.0, 1.0), rtn);
  rtn = update_rtn(p, d, SQ*vec3(0.0, 0.0, -1.0), vec3(0.0, 0.0, -1.0), rtn);
  return rtn.xyz;
}



vec3 getCubeMapDir(vec3 p, vec3 d){
  int skip = get_current_side(p);
  vec4 rtn = vec4(1.0, 0.0, 1.0, 8.0*ENV_D);
  vec3 side;
  side.x = 1.0 - 2.0*float(skip == 0);
  side.y = 0.0;
  side.z = 0.0;
  rtn = update_rtn(p, d, SQ*side, side, rtn);
  side.x = -float(skip > 1);
  side.y = float(skip < 2);
  rtn = update_rtn(p, d, SQ*side, side, rtn);
  side.x = 0.0;
  side.y = 1.0 - 2.0*float(skip < 3);
  rtn = update_rtn(p, d, SQ*side, side, rtn);
  side.y = -float(skip > 3);
  side.z = float(skip < 4);
  rtn = update_rtn(p, d, SQ*side, side, rtn);
  side.y = 0.0;
  side.z = 2.0*float(skip == 5) - 1.0;
  rtn = update_rtn(p, d, SQ*side, side, rtn);
  return rtn.xyz;
}

bool will_not_reflect(vec3 _i, vec3 n, float cos_critical_angle){
  vec3 i = normalize(_i);
  float cos_th = dot(i, n) / (sqrt(dot(i, i))*sqrt(dot(n, n)));
  return cos_th > cos_critical_angle;
}
`
assets["gem_shaders/main_func.glsl"]=`void main() {
  vec3 world_curr_dir = refract(normalize(v_pos-CAM_LOC), v_norm, 1.0/REF_INDEX);
  world_curr_dir = BLOCK_ENTRY*world_curr_dir + (1.0-BLOCK_ENTRY) * vec3(0.0, 0.0, -1.0);

  vec3 model_curr_dir = (v_mMat_inv*vec4(world_curr_dir, 0.0)).xyz;
  vec3 model_intersect = getCubeMapDirNoSkip(v_pos_orig, model_curr_dir);
  float distance_traveled = distance(model_intersect, v_pos_orig);
  vec3 model_normal = get_normal(model_intersect);


  vec3 temp;
  model_curr_dir = reflect(model_curr_dir, model_normal);
  temp = getCubeMapDir(model_intersect, model_curr_dir);
  distance_traveled = distance_traveled + distance(temp, model_intersect);
  model_intersect = temp;
  model_normal = get_normal(model_intersect);

  model_curr_dir = reflect(model_curr_dir, model_normal);
  temp = getCubeMapDir(model_intersect, model_curr_dir);
  distance_traveled = distance_traveled + distance(temp, model_intersect);
  model_intersect = temp;
  model_normal = get_normal(model_intersect);


  set_color(model_intersect, model_curr_dir, distance_traveled, (v_mMat * vec4(model_normal, 1.0)).xyz);
}
`
assets["gem_shaders/get_normal_BRIOLETTE.glsl"]=`#define cubeShape vec3(0.55627, 0.55627, 0.9999)
#define SQ vec3(0.55627, 0.55627, 0.9999)
#define BLOCK_ENTRY 1.0

vec3 get_normal(vec3 dir){
    float x = abs(dir.x);
    float y = abs(dir.y);
    float z = abs(dir.z);

    float x_max = float(x*SQ.y*SQ.z > y*SQ.x*SQ.z) * float(x*SQ.y*SQ.z > z*SQ.x*SQ.y);
    float y_max = (1.0 - x_max) * float(y*SQ.x*SQ.z > z*SQ.x*SQ.y);
    float z_max = (1.0 - x_max) * (1.0 - y_max);

    float _xpos0 = float(dir.z > dir.x*1.34814 + 1.49985);
    float _xpos1 = float(dir.z > dir.x*1.34814 + 0.9999);
    float _xpos2 = float(dir.z > dir.x*1.34814 + 0.49995);
    float _xpos3 = float(dir.z > dir.x*1.34814);
    float _xpos4 = float(dir.z > dir.x*1.34814 + -0.49995);
    float _xpos5 = float(dir.z > dir.x*1.34814 + -0.9999);
    float _xpos6 = float(dir.z > dir.x*1.34814 + -1.49985);
    float xpos = _xpos0;
    xpos = xpos + 2.0*(_xpos1 - _xpos0);
    xpos = xpos + 3.0*(_xpos2 - _xpos1);
    xpos = xpos + 4.0*(_xpos3 - _xpos2);
    xpos = xpos + 5.0*(_xpos4 - _xpos3);
    xpos = xpos + 6.0*(_xpos5 - _xpos4);
    xpos = xpos + 7.0*(_xpos6 - _xpos5);
    xpos = xpos + 8.0*(1.0 - _xpos6);


    float _xneg0 = float(dir.z > dir.x*-1.34814 + 1.49985);
    float _xneg1 = float(dir.z > dir.x*-1.34814 + 0.9999);
    float _xneg2 = float(dir.z > dir.x*-1.34814 + 0.49995);
    float _xneg3 = float(dir.z > dir.x*-1.34814);
    float _xneg4 = float(dir.z > dir.x*-1.34814 + -0.49995);
    float _xneg5 = float(dir.z > dir.x*-1.34814 + -0.9999);
    float _xneg6 = float(dir.z > dir.x*-1.34814 + -1.49985);
    float xneg = _xneg0;
    xneg = xneg + 2.0*(_xneg1 - _xneg0);
    xneg = xneg + 3.0*(_xneg2 - _xneg1);
    xneg = xneg + 4.0*(_xneg3 - _xneg2);
    xneg = xneg + 5.0*(_xneg4 - _xneg3);
    xneg = xneg + 6.0*(_xneg5 - _xneg4);
    xneg = xneg + 7.0*(_xneg6 - _xneg5);
    xneg = xneg + 8.0*(1.0 - _xneg6);

    float xrow = xneg + xpos - 9.0;
    float xcol = xpos - xneg;

    float py_dy = 1.0 - abs(xcol)*0.09763;
    float py_dz = 0.0 - xrow*0.1;
    float py_dx = xcol*0.2357;


    float _ypos0 = float(dir.z > dir.y*1.34814 + 1.49985);
    float _ypos1 = float(dir.z > dir.y*1.34814 + 0.9999);
    float _ypos2 = float(dir.z > dir.y*1.34814 + 0.49995);
    float _ypos3 = float(dir.z > dir.y*1.34814);
    float _ypos4 = float(dir.z > dir.y*1.34814 + -0.49995);
    float _ypos5 = float(dir.z > dir.y*1.34814 + -0.9999);
    float _ypos6 = float(dir.z > dir.y*1.34814 + -1.49985);
    float ypos = _ypos0;
    ypos = ypos + 2.0*(_ypos1 - _ypos0);
    ypos = ypos + 3.0*(_ypos2 - _ypos1);
    ypos = ypos + 4.0*(_ypos3 - _ypos2);
    ypos = ypos + 5.0*(_ypos4 - _ypos3);
    ypos = ypos + 6.0*(_ypos5 - _ypos4);
    ypos = ypos + 7.0*(_ypos6 - _ypos5);
    ypos = ypos + 8.0*(1.0 - _ypos6);


    float _yneg0 = float(dir.z > dir.y*-1.34814 + 1.49985);
    float _yneg1 = float(dir.z > dir.y*-1.34814 + 0.9999);
    float _yneg2 = float(dir.z > dir.y*-1.34814 + 0.49995);
    float _yneg3 = float(dir.z > dir.y*-1.34814);
    float _yneg4 = float(dir.z > dir.y*-1.34814 + -0.49995);
    float _yneg5 = float(dir.z > dir.y*-1.34814 + -0.9999);
    float _yneg6 = float(dir.z > dir.y*-1.34814 + -1.49985);
    float yneg = _yneg0;
    yneg = yneg + 2.0*(_yneg1 - _yneg0);
    yneg = yneg + 3.0*(_yneg2 - _yneg1);
    yneg = yneg + 4.0*(_yneg3 - _yneg2);
    yneg = yneg + 5.0*(_yneg4 - _yneg3);
    yneg = yneg + 6.0*(_yneg5 - _yneg4);
    yneg = yneg + 7.0*(_yneg6 - _yneg5);
    yneg = yneg + 8.0*(1.0 - _yneg6);

    float yrow = yneg + ypos - 9.0;
    float ycol = ypos - yneg;

    float px_dx = 1.0 - abs(ycol)*0.09763;
    float px_dz = 0.0 - yrow*0.1;
    float px_dy = ycol*0.2357;

    vec3 rtn = y_max*normalize(vec3(py_dx, py_dy*dir.y/y, py_dz)) + x_max*normalize(vec3(px_dx*dir.x/x, px_dy, px_dz));
    float top_tri0 = float(y > 1.5*x);
    float top_tri1 = float(x > 1.5*y);
    vec3 top_norm = (1.0-top_tri0)*(1.0-top_tri1)*normalize(vec3(1.0 - 3.0*0.09763, 0.2357*3.0, 0.0 + 0.4*z/dir.z));
    top_norm = top_norm + top_tri0*normalize(vec3(0.2357, 1.0 - 0.09763, 0.0 + 0.4*z/dir.z));
    top_norm = top_norm + top_tri1*normalize(vec3(1.0 - 0.09763, 0.2357, 0.0 + 0.4*z/dir.z));
    rtn = rtn + z_max * top_norm * vec3(x/dir.x, y/dir.y, 1);
    vec3 comparator = vec3(x_max, y_max, z_max) * vec3(x/dir.x, y/dir.y, z/dir.z);
    return rtn;
}`
assets["levels/e1.txt"]=`false
0
MARQUISE-RECTANGLE-BRIOLETTE-TRILLIANT
1-2-29-31-33
[[1,-1,-1,-1],[2,-1,0,-1],[-1,-1,1,-1]]
SQUARE
1-0-0
1-1-0
1-2-0
-2
[[1,-1,-1,-1],[2,-1,0,-1],[-1,-1,1,-1]]
SQUARE
1-0-0
1-0-1
1-0-2
-2
[[1,-1,-1,-1],[2,3,0,-1],[-1,-1,1,-1],[-1,-1,-1,1]]
SQUARE
1-0-0
1-0-1
1-0-2
1-1-1
-2
[[1,-1,-1,-1],[-1,2,0,-1],[3,-1,-1,1],[-1,-1,2,-1]]
SQUARE
1-0-0
1-0-1
1-1-1
1-1-2
-2
[[1,2,-1,-1],[-1,-1,0,-1],[-1,-1,-1,0]]
SQUARE
1-1-0
1-1-0
1-1-1
-2
[[-1,1,-1,-1],[2,-1,-1,0],[-1,3,1,-1],[-1,-1,-1,2]]
SQUARE
1-1-0
1-1-1
1-1-0
1-1-0
-2`
assets["levels/e1_short.txt"]=`false
0
MARQUISE-RECTANGLE-BRIOLETTE-TRILLIANT
1-2-3-4-5
[[1,-1,-1,-1],[2,-1,0,-1],[-1,-1,1,-1]]
SQUARE
1-0-0
1-1-0
1-2-0
-2
[[1,-1,-1,-1],[2,-1,0,-1],[-1,-1,1,-1]]
SQUARE
1-0-0
1-0-1
1-0-2
-2
[[1,-1,-1,-1],[2,3,0,-1],[-1,-1,1,-1],[-1,-1,-1,1]]
SQUARE
1-0-0
1-0-1
1-0-2
1-1-1
-2
[[1,-1,-1,-1],[-1,2,0,-1],[3,-1,-1,1],[-1,-1,2,-1]]
SQUARE
1-0-0
1-0-1
1-1-1
1-1-2
-2`
assets["levels/ad1_short.txt"]=`false
0
MARQUISE-RECTANGLE-BRIOLETTE-TRILLIANT
1-2-3-4-5
[[1,-1,-1,-1],[-1,2,0,-1],[-1,-1,-1,1]]
SQUARE
1-0-0
1-0-1
1-1-1
-2
[[1,-1,-1,-1],[-1,2,0,-1],[3,-1,-1,1],[-1,-1,2,-1]]
SQUARE
1-0-0
1-0-1
1-1-1
1-1-2
-2
[[1,-1,-1,-1],[3,2,0,-1],[-1,-1,-1,1],[-1,-1,1,4],[-1,3,-1,-1]]
SQUARE
1-2-2
1-0-0
1-1-1
1-0-1
1-0-2
-2`
assets["levels/ad2.txt"]=`false
2
PRINCESS-HEART-ROSE-TRILLIANT
1-2-3-4-5
[[2,1,-1,-1,-1,-1],[-1,-1,-1,-1,0,2],[-1,-1,1,0,-1,-1]]
HEX
1-0-0
1-0-1
1-0-2
1-1-0
1-2-0
-3
[[-1,1,-1,-1,-1,-1],[2,-1,-1,-1,0,-1],[-1,3,-1,1,-1,-1],[-1,-1,-1,-1,2,-1]]
HEX
1-2-1
1-1-3
1-0-2
1-1-0
1-0-3
-3
[[1,-1,-1,-1,-1,-1],[3,2,-1,0,-1,-1],[-1,-1,-1,-1,1,3],[-1,-1,2,1,-1,-1]]
HEX
1-0-0
1-0-0
1-1-0
1-0-1
-3
[[2,1,-1,-1,-1,3],[-1,-1,-1,-1,0,2],[-1,-1,1,0,3,-1],[-1,2,0,-1,-1,-1]]
HEX
1-2-2
1-2-2
1-1-2
1-2-0
-3
[[-1,-1,-1,-1,-1,2],[-1,2,-1,-1,-1,-1],[3,-1,0,-1,1,-1],[-1,-1,-1,2,-1,-1]]
HEX
1-0-1
1-1-0
1-0-0
1-2-2
1-2-0
1-1-2
-3
[[-1,1,-1,-1,-1,2],[3,-1,-1,-1,0,-1],[4,-1,0,-1,-1,-1],[-1,-1,-1,1,-1,5],[-1,5,-1,2,-1,-1],[-1,-1,3,-1,4,-1]]
HEX
1-0-0
1-1-0
1-1-1
1-2-1
1-2-2
1-0-2
-3`
assets["levels/ad2_short.txt"]=`false
2
PRINCESS-HEART-ROSE-TRILLIANT
1-2-3-4-5
[[2,1,-1,-1,-1,-1],[-1,-1,-1,-1,0,2],[-1,-1,1,0,-1,-1]]
HEX
1-0-0
1-0-1
1-0-2
1-1-0
1-2-0
-3
[[2,1,-1,-1,-1,3],[-1,-1,-1,-1,0,2],[-1,-1,1,0,3,-1],[-1,2,0,-1,-1,-1]]
HEX
1-2-2
1-2-2
1-1-2
1-2-0
-3
[[-1,1,-1,-1,-1,2],[3,-1,-1,-1,0,-1],[4,-1,0,-1,-1,-1],[-1,-1,-1,1,-1,5],[-1,5,-1,2,-1,-1],[-1,-1,3,-1,4,-1]]
HEX
1-0-0
1-1-0
1-1-1
1-2-1
1-2-2
1-0-2
-3`
assets["levels/ad1.txt"]=`false
0
MARQUISE-RECTANGLE-BRIOLETTE-TRILLIANT
1-28-37-39-41
[[1,-1,-1,-1],[-1,2,0,-1],[-1,-1,-1,1]]
SQUARE
1-0-0
1-0-1
1-1-1
-2
[[1,-1,-1,-1],[-1,2,0,-1],[3,-1,-1,1],[-1,-1,2,-1]]
SQUARE
1-0-0
1-0-1
1-1-1
1-1-2
-2
[[1,-1,-1,-1],[3,2,0,-1],[-1,-1,-1,1],[-1,-1,1,4],[-1,3,-1,-1]]
SQUARE
1-0-0
1-1-1
1-0-1
1-0-2
1-2-2
-2
[[1,-1,-1,2],[-1,-1,0,-1],[-1,0,-1,-1]]
1-1-2
1-1-2
1-2-2
SQUARE
-2
[[1,-1,-1,3],[-1,2,0,-1],[-1,-1,-1,1],[-1,0,-1,-1]]
SQUARE
1-0-1
1-2-1
1-2-1
1-2-1
-2
[[1,3,-1,-1],[-1,2,0,-1],[-1,-1,3,1],[2,-1,-1,0]]
SQUARE
1-0-0
1-0-2
1-1-2
1-1-0
-2`
assets["levels/e3.txt"]=`false
2
PRINCESS-HEART-ROSE-TRILLIANT
1-2-3-4-43
[[2,1,-1,-1,-1,-1],[-1,-1,-1,-1,0,2],[-1,-1,1,0,-1,-1]]
HEX
1-0-0
1-0-1
1-0-2
1-1-0
1-2-0
-3
[[-1,1,-1,-1,-1,-1],[2,-1,-1,-1,0,-1],[-1,3,-1,1,-1,-1],[-1,-1,-1,-1,2,-1]]
HEX
1-2-1
1-1-3
1-0-2
1-1-0
1-0-3
-3
[[1,-1,-1,-1,-1,-1],[3,2,-1,0,-1,-1],[-1,-1,-1,-1,1,3],[-1,-1,2,1,-1,-1]]
HEX
1-0-0
1-0-0
1-1-0
1-0-1
-3
[[2,1,-1,-1,-1,-1],[-1,-1,-1,-1,0,2],[-1,-1,1,0,-1,-1]]
HEX
1-0-1
1-0-0
1-1-2
1-1-0
1-3-2
1-2-2
-3
[[-1,1,-1,-1,-1,2],[3,-1,-1,-1,0,-1],[4,-1,0,-1,-1,-1],[-1,-1,-1,1,-1,5],[-1,5,-1,2,-1,-1],[-1,-1,3,-1,4,-1]]
HEX
1-0-0
1-1-0
1-1-1
1-2-1
1-2-2
1-0-2
-3
[[-1,-1,-1,-1,-1,2],[-1,2,-1,-1,-1,-1],[3,-1,0,-1,1,-1],[-1,-1,-1,2,-1,-1]]
HEX
1-0-1
1-1-0
1-0-0
1-2-2
1-2-0
1-1-2
-3`
assets["levels/e3_short.txt"]=`false
2
PRINCESS-HEART-ROSE-TRILLIANT
1-2-3-4-5
[[-1,1,-1,-1,-1,-1],[2,-1,-1,-1,0,-1],[-1,3,-1,1,-1,-1],[-1,-1,-1,-1,2,-1]]
HEX
1-2-1
1-1-3
1-0-2
1-1-0
1-0-3
-3
[[1,-1,-1,-1,-1,-1],[3,2,-1,0,-1,-1],[-1,-1,-1,-1,1,3],[-1,-1,2,1,-1,-1]]
HEX
1-0-0
1-0-0
1-1-0
1-0-1
-3
[[2,1,-1,-1,-1,-1],[-1,-1,-1,-1,0,2],[-1,-1,1,0,-1,-1]]
HEX
1-0-1
1-0-0
1-1-2
1-1-0
1-3-2
1-2-2
-3
[[-1,1,-1,-1,-1,2],[3,-1,-1,-1,0,-1],[4,-1,0,-1,-1,-1],[-1,-1,-1,1,-1,5],[-1,5,-1,2,-1,-1],[-1,-1,3,-1,4,-1]]
HEX
1-0-0
1-1-0
1-1-1
1-2-1
1-2-2
1-0-2
-3`
assets["objs/princess.obj"]=`v 0 0.3927 0.37125
v 0.3388 0.3388 0.37125
v 0.3927 0 0.37125
v 0.3388 -0.3388 0.37125
v 0 -0.3927 0.37125
v -0.3388 -0.3388 0.37125
v -0.3927 0 0.37125
v -0.3388 0.3388 0.37125
v 0.3388 0.3388 0.37125
v 0.59921 0.48371 0.26268
v 0.48371 0.59921 0.26268
v 0.48371 0.59921 0.26268
v 0.59921 0.48371 0.26268
v 0.77 0.77 0.14025
v 0.3927 0 0.37125
v 0.59921 0.48371 0.26268
v 0.3388 0.3388 0.37125
v 0 0.3927 0.37125
v 0.3388 0.3388 0.37125
v 0.48371 0.59921 0.26268
v 0.3927 0 0.37125
v 0.59921 -0.48371 0.26268
v 0.59921 0.48371 0.26268
v 0.77 0.77 0.14025
v 0.59921 0.48371 0.26268
v 0.59921 -0.48371 0.26268
v 0.59921 -0.48371 0.26268
v 0.77 -0.77 0.14025
v 0.77 0.77 0.14025
v 0.77 0.77 0.14025
v 0.77 -0.77 0.14025
v 0.46657 0 -0.14424
v 0.77 0.77 0.14025
v 0.46657 0 -0.14424
v 0.31169 0 -0.2441
v 0.77 -0.77 0.14025
v 0.31169 0 -0.2441
v 0.46657 0 -0.14424
v 0.77 0.77 0.14025
v 0.31169 0 -0.2441
v 0.12985 0 -0.32812
v 0.77 -0.77 0.14025
v 0.12985 0 -0.32812
v 0.31169 0 -0.2441
v 0.77 0.77 0.14025
v 0.12985 0 -0.32812
v 0 0 -0.37125
v 0.77 -0.77 0.14025
v 0 0 -0.37125
v 0.12985 0 -0.32812
v -0.3388 0.3388 0.37125
v -0.48371 0.59921 0.26268
v -0.59921 0.48371 0.26268
v -0.59921 0.48371 0.26268
v -0.48371 0.59921 0.26268
v -0.77 0.77 0.14025
v 0 0.3927 0.37125
v -0.48371 0.59921 0.26268
v -0.3388 0.3388 0.37125
v -0.3927 0 0.37125
v -0.3388 0.3388 0.37125
v -0.59921 0.48371 0.26268
v 0 0.3927 0.37125
v 0.48371 0.59921 0.26268
v -0.48371 0.59921 0.26268
v -0.77 0.77 0.14025
v -0.48371 0.59921 0.26268
v 0.48371 0.59921 0.26268
v 0.48371 0.59921 0.26268
v 0.77 0.77 0.14025
v -0.77 0.77 0.14025
v -0.77 0.77 0.14025
v 0.77 0.77 0.14025
v 0 0.46657 -0.14424
v -0.77 0.77 0.14025
v 0 0.46657 -0.14424
v 0 0.31169 -0.2441
v 0.77 0.77 0.14025
v 0 0.31169 -0.2441
v 0 0.46657 -0.14424
v -0.77 0.77 0.14025
v 0 0.31169 -0.2441
v 0 0.12985 -0.32812
v 0.77 0.77 0.14025
v 0 0.12985 -0.32812
v 0 0.31169 -0.2441
v -0.77 0.77 0.14025
v 0 0.12985 -0.32812
v 0 0 -0.37125
v 0.77 0.77 0.14025
v 0 0 -0.37125
v 0 0.12985 -0.32812
v -0.3388 -0.3388 0.37125
v -0.59921 -0.48371 0.26268
v -0.48371 -0.59921 0.26268
v -0.48371 -0.59921 0.26268
v -0.59921 -0.48371 0.26268
v -0.77 -0.77 0.14025
v -0.3927 0 0.37125
v -0.59921 -0.48371 0.26268
v -0.3388 -0.3388 0.37125
v 0 -0.3927 0.37125
v -0.3388 -0.3388 0.37125
v -0.48371 -0.59921 0.26268
v -0.3927 0 0.37125
v -0.59921 0.48371 0.26268
v -0.59921 -0.48371 0.26268
v -0.77 -0.77 0.14025
v -0.59921 -0.48371 0.26268
v -0.59921 0.48371 0.26268
v -0.59921 0.48371 0.26268
v -0.77 0.77 0.14025
v -0.77 -0.77 0.14025
v -0.77 -0.77 0.14025
v -0.77 0.77 0.14025
v -0.46657 0 -0.14424
v -0.77 -0.77 0.14025
v -0.46657 0 -0.14424
v -0.31169 0 -0.2441
v -0.77 0.77 0.14025
v -0.31169 0 -0.2441
v -0.46657 0 -0.14424
v -0.77 -0.77 0.14025
v -0.31169 0 -0.2441
v -0.12985 0 -0.32812
v -0.77 0.77 0.14025
v -0.12985 0 -0.32812
v -0.31169 0 -0.2441
v -0.77 -0.77 0.14025
v -0.12985 0 -0.32812
v 0 0 -0.37125
v -0.77 0.77 0.14025
v 0 0 -0.37125
v -0.12985 0 -0.32812
v 0.3388 -0.3388 0.37125
v 0.48371 -0.59921 0.26268
v 0.59921 -0.48371 0.26268
v 0.59921 -0.48371 0.26268
v 0.48371 -0.59921 0.26268
v 0.77 -0.77 0.14025
v 0 -0.3927 0.37125
v 0.48371 -0.59921 0.26268
v 0.3388 -0.3388 0.37125
v 0.3927 0 0.37125
v 0.3388 -0.3388 0.37125
v 0.59921 -0.48371 0.26268
v 0 -0.3927 0.37125
v -0.48371 -0.59921 0.26268
v 0.48371 -0.59921 0.26268
v 0.77 -0.77 0.14025
v 0.48371 -0.59921 0.26268
v -0.48371 -0.59921 0.26268
v -0.48371 -0.59921 0.26268
v -0.77 -0.77 0.14025
v 0.77 -0.77 0.14025
v 0.77 -0.77 0.14025
v -0.77 -0.77 0.14025
v 0 -0.46657 -0.14424
v 0.77 -0.77 0.14025
v 0 -0.46657 -0.14424
v 0 -0.31169 -0.2441
v -0.77 -0.77 0.14025
v 0 -0.31169 -0.2441
v 0 -0.46657 -0.14424
v 0.77 -0.77 0.14025
v 0 -0.31169 -0.2441
v 0 -0.12985 -0.32812
v -0.77 -0.77 0.14025
v 0 -0.12985 -0.32812
v 0 -0.31169 -0.2441
v 0.77 -0.77 0.14025
v 0 -0.12985 -0.32812
v 0 0 -0.37125
v -0.77 -0.77 0.14025
v 0 0 -0.37125
v 0 -0.12985 -0.32812
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0.25049 0.25049 0.93515
vn 0.25049 0.25049 0.93515
vn 0.25049 0.25049 0.93515
vn 0.25049 0.25049 0.93515
vn 0.25049 0.25049 0.93515
vn 0.25049 0.25049 0.93515
vn 0.35709 0.05681 0.93234
vn 0.35709 0.05681 0.93234
vn 0.35709 0.05681 0.93234
vn 0.05681 0.35709 0.93234
vn 0.05681 0.35709 0.93234
vn 0.05681 0.35709 0.93234
vn 0.46534 0 0.88513
vn 0.46534 0 0.88513
vn 0.46534 0 0.88513
vn 0.58262 0 0.81274
vn 0.58262 0 0.81274
vn 0.58262 0 0.81274
vn 0.58262 0 0.81274
vn 0.58262 0 0.81274
vn 0.58262 0 0.81274
vn 0.68397 0 -0.72951
vn 0.68397 0 -0.72951
vn 0.68397 0 -0.72951
vn 0.53937 0.09652 -0.83652
vn 0.53937 0.09652 -0.83652
vn 0.53937 0.09652 -0.83652
vn 0.53937 -0.09652 -0.83652
vn 0.53937 -0.09652 -0.83652
vn 0.53937 -0.09652 -0.83652
vn 0.41101 0.19939 -0.88956
vn 0.41101 0.19939 -0.88956
vn 0.41101 0.19939 -0.88956
vn 0.41101 -0.19939 -0.88956
vn 0.41101 -0.19939 -0.88956
vn 0.41101 -0.19939 -0.88956
vn 0.30063 0.30063 -0.90512
vn 0.30063 0.30063 -0.90512
vn 0.30063 0.30063 -0.90512
vn 0.30063 -0.30063 -0.90512
vn 0.30063 -0.30063 -0.90512
vn 0.30063 -0.30063 -0.90512
vn -0.25049 0.25049 0.93515
vn -0.25049 0.25049 0.93515
vn -0.25049 0.25049 0.93515
vn -0.25049 0.25049 0.93515
vn -0.25049 0.25049 0.93515
vn -0.25049 0.25049 0.93515
vn -0.05681 0.35709 0.93234
vn -0.05681 0.35709 0.93234
vn -0.05681 0.35709 0.93234
vn -0.35709 0.05681 0.93234
vn -0.35709 0.05681 0.93234
vn -0.35709 0.05681 0.93234
vn 0 0.46534 0.88513
vn 0 0.46534 0.88513
vn 0 0.46534 0.88513
vn 0 0.58262 0.81274
vn 0 0.58262 0.81274
vn 0 0.58262 0.81274
vn 0 0.58262 0.81274
vn 0 0.58262 0.81274
vn 0 0.58262 0.81274
vn 0 0.68397 -0.72951
vn 0 0.68397 -0.72951
vn 0 0.68397 -0.72951
vn -0.09652 0.53937 -0.83652
vn -0.09652 0.53937 -0.83652
vn -0.09652 0.53937 -0.83652
vn 0.09652 0.53937 -0.83652
vn 0.09652 0.53937 -0.83652
vn 0.09652 0.53937 -0.83652
vn -0.19939 0.41101 -0.88956
vn -0.19939 0.41101 -0.88956
vn -0.19939 0.41101 -0.88956
vn 0.19939 0.41101 -0.88956
vn 0.19939 0.41101 -0.88956
vn 0.19939 0.41101 -0.88956
vn -0.30063 0.30063 -0.90512
vn -0.30063 0.30063 -0.90512
vn -0.30063 0.30063 -0.90512
vn 0.30063 0.30063 -0.90512
vn 0.30063 0.30063 -0.90512
vn 0.30063 0.30063 -0.90512
vn -0.25049 -0.25049 0.93515
vn -0.25049 -0.25049 0.93515
vn -0.25049 -0.25049 0.93515
vn -0.25049 -0.25049 0.93515
vn -0.25049 -0.25049 0.93515
vn -0.25049 -0.25049 0.93515
vn -0.35709 -0.05681 0.93234
vn -0.35709 -0.05681 0.93234
vn -0.35709 -0.05681 0.93234
vn -0.05681 -0.35709 0.93234
vn -0.05681 -0.35709 0.93234
vn -0.05681 -0.35709 0.93234
vn -0.46534 0 0.88513
vn -0.46534 0 0.88513
vn -0.46534 0 0.88513
vn -0.58262 0 0.81274
vn -0.58262 0 0.81274
vn -0.58262 0 0.81274
vn -0.58262 0 0.81274
vn -0.58262 0 0.81274
vn -0.58262 0 0.81274
vn -0.68397 0 -0.72951
vn -0.68397 0 -0.72951
vn -0.68397 0 -0.72951
vn -0.53937 -0.09652 -0.83652
vn -0.53937 -0.09652 -0.83652
vn -0.53937 -0.09652 -0.83652
vn -0.53937 0.09652 -0.83652
vn -0.53937 0.09652 -0.83652
vn -0.53937 0.09652 -0.83652
vn -0.41101 -0.19939 -0.88956
vn -0.41101 -0.19939 -0.88956
vn -0.41101 -0.19939 -0.88956
vn -0.41101 0.19939 -0.88956
vn -0.41101 0.19939 -0.88956
vn -0.41101 0.19939 -0.88956
vn -0.30063 -0.30063 -0.90512
vn -0.30063 -0.30063 -0.90512
vn -0.30063 -0.30063 -0.90512
vn -0.30063 0.30063 -0.90512
vn -0.30063 0.30063 -0.90512
vn -0.30063 0.30063 -0.90512
vn 0.25049 -0.25049 0.93515
vn 0.25049 -0.25049 0.93515
vn 0.25049 -0.25049 0.93515
vn 0.25049 -0.25049 0.93515
vn 0.25049 -0.25049 0.93515
vn 0.25049 -0.25049 0.93515
vn 0.05681 -0.35709 0.93234
vn 0.05681 -0.35709 0.93234
vn 0.05681 -0.35709 0.93234
vn 0.35709 -0.05681 0.93234
vn 0.35709 -0.05681 0.93234
vn 0.35709 -0.05681 0.93234
vn 0 -0.46534 0.88513
vn 0 -0.46534 0.88513
vn 0 -0.46534 0.88513
vn 0 -0.58262 0.81274
vn 0 -0.58262 0.81274
vn 0 -0.58262 0.81274
vn 0 -0.58262 0.81274
vn 0 -0.58262 0.81274
vn 0 -0.58262 0.81274
vn 0 -0.68397 -0.72951
vn 0 -0.68397 -0.72951
vn 0 -0.68397 -0.72951
vn 0.09652 -0.53937 -0.83652
vn 0.09652 -0.53937 -0.83652
vn 0.09652 -0.53937 -0.83652
vn -0.09652 -0.53937 -0.83652
vn -0.09652 -0.53937 -0.83652
vn -0.09652 -0.53937 -0.83652
vn 0.19939 -0.41101 -0.88956
vn 0.19939 -0.41101 -0.88956
vn 0.19939 -0.41101 -0.88956
vn -0.19939 -0.41101 -0.88956
vn -0.19939 -0.41101 -0.88956
vn -0.19939 -0.41101 -0.88956
vn 0.30063 -0.30063 -0.90512
vn 0.30063 -0.30063 -0.90512
vn 0.30063 -0.30063 -0.90512
vn -0.30063 -0.30063 -0.90512
vn -0.30063 -0.30063 -0.90512
vn -0.30063 -0.30063 -0.90512
f 1 5 3
f 1 7 5
f 1 3 2
f 3 5 4
f 5 7 6
f 7 1 8
f 9 10 11
f 12 13 14
f 15 16 17
f 18 19 20
f 21 22 23
f 24 25 26
f 27 28 29
f 30 31 32
f 33 34 35
f 36 37 38
f 39 40 41
f 42 43 44
f 45 46 47
f 48 49 50
f 51 52 53
f 54 55 56
f 57 58 59
f 60 61 62
f 63 64 65
f 66 67 68
f 69 70 71
f 72 73 74
f 75 76 77
f 78 79 80
f 81 82 83
f 84 85 86
f 87 88 89
f 90 91 92
f 93 94 95
f 96 97 98
f 99 100 101
f 102 103 104
f 105 106 107
f 108 109 110
f 111 112 113
f 114 115 116
f 117 118 119
f 120 121 122
f 123 124 125
f 126 127 128
f 129 130 131
f 132 133 134
f 135 136 137
f 138 139 140
f 141 142 143
f 144 145 146
f 147 148 149
f 150 151 152
f 153 154 155
f 156 157 158
f 159 160 161
f 162 163 164
f 165 166 167
f 168 169 170
f 171 172 173
f 174 175 176`
assets["objs/square.obj"]=`v -1 -1 0
v -1 1 0
v 1 1 0
v 1 -1 0
vt 0 1
vt 0 0
vt 1 0
vt 1 1
vn 0 0 1
f 1/1/1 3/3/1 2/2/1
f 3/3/1 1/1/1 4/4/1`
assets["objs/heart.obj"]=`v 0 0.35585 0.25
v 0.3 0.4974 0.25
v 0.55 0.39784 0.25
v 0.48665 0.12615 0.25
v 0.29849 -0.13259 0.25
v 0 -0.30954 0.25
v -0.29849 -0.13259 0.25
v -0.48665 0.12615 0.25
v -0.55 0.39784 0.25
v -0.3 0.4974 0.25
v 0 0.35585 0.25
v 0.3 0.4974 0.25
v 0 0.48759 0.18
v 0.3 0.4974 0.25
v 0.55 0.39784 0.25
v 0.49706 0.60504 0.18
v 0.55 0.39784 0.25
v 0.48665 0.12615 0.25
v 0.69728 0.34269 0.18
v 0.48665 0.12615 0.25
v 0.29849 -0.13259 0.25
v 0.47096 -0.12358 0.156
v 0.29849 -0.13259 0.25
v 0 -0.30954 0.25
v 0.07852 -0.42197 0.184
v 0 0.48759 0.18
v 0.21338 0.69507 0
v 0.3 0.4974 0.25
v 0.49706 0.60504 0.18
v 0.49706 0.60504 0.18
v 0.76811 0.60432 0
v 0.55 0.39784 0.25
v 0.69728 0.34269 0.18
v 0.69728 0.34269 0.18
v 0.76015 0.03276 0
v 0.48665 0.12615 0.25
v 0.47096 -0.12358 0.156
v 0.47096 -0.12358 0.156
v 0.38388 -0.43227 0
v 0.29849 -0.13259 0.25
v 0.07852 -0.42197 0.184
v 0 0.48759 0.18
v 0.21338 0.69507 0
v 0 0.56013 0
v 0.21338 0.69507 0
v 0.49706 0.60504 0.18
v 0.41318 0.73538 0
v 0.41318 0.73538 0
v 0.49706 0.60504 0.18
v 0.61653 0.69593 0
v 0.61653 0.69593 0
v 0.49706 0.60504 0.18
v 0.76811 0.60432 0
v 0.76811 0.60432 0
v 0.69728 0.34269 0.18
v 0.84859 0.41759 0
v 0.84859 0.41759 0
v 0.69728 0.34269 0.18
v 0.82635 0.22328 0
v 0.82635 0.22328 0
v 0.69728 0.34269 0.18
v 0.76015 0.03276 0
v 0.76015 0.03276 0
v 0.47096 -0.12358 0.156
v 0.38388 -0.43227 0
v 0.38388 -0.43227 0
v 0.07852 -0.42197 0.184
v 0 -0.73538 0
v 0 0.35585 0.25
v -0.3 0.4974 0.25
v 0 0.48759 0.18
v -0.3 0.4974 0.25
v -0.55 0.39784 0.25
v -0.49706 0.60504 0.18
v -0.55 0.39784 0.25
v -0.48665 0.12615 0.25
v -0.69728 0.34269 0.18
v -0.48665 0.12615 0.25
v -0.29849 -0.13259 0.25
v -0.47096 -0.12358 0.156
v -0.29849 -0.13259 0.25
v 0 -0.30954 0.25
v -0.07852 -0.42197 0.184
v 0 0.48759 0.18
v -0.21338 0.69507 0
v -0.3 0.4974 0.25
v -0.49706 0.60504 0.18
v -0.49706 0.60504 0.18
v -0.76811 0.60432 0
v -0.55 0.39784 0.25
v -0.69728 0.34269 0.18
v -0.69728 0.34269 0.18
v -0.76015 0.03276 0
v -0.48665 0.12615 0.25
v -0.47096 -0.12358 0.156
v -0.47096 -0.12358 0.156
v -0.38388 -0.43227 0
v -0.29849 -0.13259 0.25
v -0.07852 -0.42197 0.184
v 0 0.48759 0.18
v -0.21338 0.69507 0
v 0 0.56013 0
v -0.21338 0.69507 0
v -0.49706 0.60504 0.18
v -0.41318 0.73538 0
v -0.41318 0.73538 0
v -0.49706 0.60504 0.18
v -0.61653 0.69593 0
v -0.61653 0.69593 0
v -0.49706 0.60504 0.18
v -0.76811 0.60432 0
v -0.76811 0.60432 0
v -0.69728 0.34269 0.18
v -0.84859 0.41759 0
v -0.84859 0.41759 0
v -0.69728 0.34269 0.18
v -0.82635 0.22328 0
v -0.82635 0.22328 0
v -0.69728 0.34269 0.18
v -0.76015 0.03276 0
v -0.76015 0.03276 0
v -0.47096 -0.12358 0.156
v -0.38388 -0.43227 0
v -0.38388 -0.43227 0
v -0.07852 -0.42197 0.184
v 0 -0.73538 0
v 0.07852 -0.42197 0.184
v 0 -0.30954 0.25
v 0 -0.73538 0
v -0.07852 -0.42197 0.184
v 0 0.35585 -0.25
v -0.3 0.4974 -0.25
v -0.55 0.39784 -0.25
v -0.48665 0.12615 -0.25
v -0.29849 -0.13259 -0.25
v 0 -0.30954 -0.25
v 0.29849 -0.13259 -0.25
v 0.48665 0.12615 -0.25
v 0.55 0.39784 -0.25
v 0.3 0.4974 -0.25
v 0 0.35585 -0.25
v -0.3 0.4974 -0.25
v 0 0.48759 -0.18
v -0.3 0.4974 -0.25
v -0.55 0.39784 -0.25
v -0.49706 0.60504 -0.18
v -0.55 0.39784 -0.25
v -0.48665 0.12615 -0.25
v -0.69728 0.34269 -0.18
v -0.48665 0.12615 -0.25
v -0.29849 -0.13259 -0.25
v -0.47096 -0.12358 -0.156
v -0.29849 -0.13259 -0.25
v 0 -0.30954 -0.25
v -0.07852 -0.42197 -0.184
v 0 0.48759 -0.18
v -0.21338 0.69507 0
v -0.3 0.4974 -0.25
v -0.49706 0.60504 -0.18
v -0.49706 0.60504 -0.18
v -0.76811 0.60432 0
v -0.55 0.39784 -0.25
v -0.69728 0.34269 -0.18
v -0.69728 0.34269 -0.18
v -0.76015 0.03276 0
v -0.48665 0.12615 -0.25
v -0.47096 -0.12358 -0.156
v -0.47096 -0.12358 -0.156
v -0.38388 -0.43227 0
v -0.29849 -0.13259 -0.25
v -0.07852 -0.42197 -0.184
v 0 0.48759 -0.18
v -0.21338 0.69507 0
v 0 0.56013 0
v -0.21338 0.69507 0
v -0.49706 0.60504 -0.18
v -0.41318 0.73538 0
v -0.41318 0.73538 0
v -0.49706 0.60504 -0.18
v -0.61653 0.69593 0
v -0.61653 0.69593 0
v -0.49706 0.60504 -0.18
v -0.76811 0.60432 0
v -0.76811 0.60432 0
v -0.69728 0.34269 -0.18
v -0.84859 0.41759 0
v -0.84859 0.41759 0
v -0.69728 0.34269 -0.18
v -0.82635 0.22328 0
v -0.82635 0.22328 0
v -0.69728 0.34269 -0.18
v -0.76015 0.03276 0
v -0.76015 0.03276 0
v -0.47096 -0.12358 -0.156
v -0.38388 -0.43227 0
v -0.38388 -0.43227 0
v -0.07852 -0.42197 -0.184
v 0 -0.73538 0
v 0 0.35585 -0.25
v 0.3 0.4974 -0.25
v 0 0.48759 -0.18
v 0.3 0.4974 -0.25
v 0.55 0.39784 -0.25
v 0.49706 0.60504 -0.18
v 0.55 0.39784 -0.25
v 0.48665 0.12615 -0.25
v 0.69728 0.34269 -0.18
v 0.48665 0.12615 -0.25
v 0.29849 -0.13259 -0.25
v 0.47096 -0.12358 -0.156
v 0.29849 -0.13259 -0.25
v 0 -0.30954 -0.25
v 0.07852 -0.42197 -0.184
v 0 0.48759 -0.18
v 0.21338 0.69507 0
v 0.3 0.4974 -0.25
v 0.49706 0.60504 -0.18
v 0.49706 0.60504 -0.18
v 0.76811 0.60432 0
v 0.55 0.39784 -0.25
v 0.69728 0.34269 -0.18
v 0.69728 0.34269 -0.18
v 0.76015 0.03276 0
v 0.48665 0.12615 -0.25
v 0.47096 -0.12358 -0.156
v 0.47096 -0.12358 -0.156
v 0.38388 -0.43227 0
v 0.29849 -0.13259 -0.25
v 0.07852 -0.42197 -0.184
v 0 0.48759 -0.18
v 0.21338 0.69507 0
v 0 0.56013 0
v 0.21338 0.69507 0
v 0.49706 0.60504 -0.18
v 0.41318 0.73538 0
v 0.41318 0.73538 0
v 0.49706 0.60504 -0.18
v 0.61653 0.69593 0
v 0.61653 0.69593 0
v 0.49706 0.60504 -0.18
v 0.76811 0.60432 0
v 0.76811 0.60432 0
v 0.69728 0.34269 -0.18
v 0.84859 0.41759 0
v 0.84859 0.41759 0
v 0.69728 0.34269 -0.18
v 0.82635 0.22328 0
v 0.82635 0.22328 0
v 0.69728 0.34269 -0.18
v 0.76015 0.03276 0
v 0.76015 0.03276 0
v 0.47096 -0.12358 -0.156
v 0.38388 -0.43227 0
v 0.38388 -0.43227 0
v 0.07852 -0.42197 -0.184
v 0 -0.73538 0
v -0.07852 -0.42197 -0.184
v 0 -0.30954 -0.25
v 0 -0.73538 0
v 0.07852 -0.42197 -0.184
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn -0.21616 0.45814 0.8622
vn -0.21616 0.45814 0.8622
vn -0.21616 0.45814 0.8622
vn 0.13883 0.34861 0.92693
vn 0.13883 0.34861 0.92693
vn 0.13883 0.34861 0.92693
vn 0.3988 -0.09299 0.91231
vn 0.3988 -0.09299 0.91231
vn 0.3988 -0.09299 0.91231
vn 0.46403 -0.33745 0.81902
vn 0.46403 -0.33745 0.81902
vn 0.46403 -0.33745 0.81902
vn 0.22166 -0.3739 0.90059
vn 0.22166 -0.3739 0.90059
vn 0.22166 -0.3739 0.90059
vn -0.17529 0.74181 0.64729
vn -0.17529 0.74181 0.64729
vn -0.17529 0.74181 0.64729
vn -0.17529 0.74181 0.64729
vn 0.51027 0.38941 0.7668
vn 0.51027 0.38941 0.7668
vn 0.51027 0.38941 0.7668
vn 0.51027 0.38941 0.7668
vn 0.57774 -0.3191 0.75126
vn 0.57774 -0.3191 0.75126
vn 0.57774 -0.3191 0.75126
vn 0.57774 -0.3191 0.75126
vn 0.43425 -0.50086 0.74871
vn 0.43425 -0.50086 0.74871
vn 0.43425 -0.50086 0.74871
vn 0.43425 -0.50086 0.74871
vn -0.50595 0.80004 0.32242
vn -0.50595 0.80004 0.32242
vn -0.50595 0.80004 0.32242
vn -0.15429 0.7647 0.62564
vn -0.15429 0.7647 0.62564
vn -0.15429 0.7647 0.62564
vn 0.16172 0.83356 0.52823
vn 0.16172 0.83356 0.52823
vn 0.16172 0.83356 0.52823
vn 0.40876 0.67632 0.61279
vn 0.40876 0.67632 0.61279
vn 0.40876 0.67632 0.61279
vn 0.67024 0.28887 0.68362
vn 0.67024 0.28887 0.68362
vn 0.67024 0.28887 0.68362
vn 0.78041 -0.0893 0.61886
vn 0.78041 -0.0893 0.61886
vn 0.78041 -0.0893 0.61886
vn 0.70384 -0.24455 0.66694
vn 0.70384 -0.24455 0.66694
vn 0.70384 -0.24455 0.66694
vn 0.60385 -0.4886 0.62979
vn 0.60385 -0.4886 0.62979
vn 0.60385 -0.4886 0.62979
vn 0.42264 -0.53525 0.73136
vn 0.42264 -0.53525 0.73136
vn 0.42264 -0.53525 0.73136
vn 0.21616 0.45814 0.8622
vn 0.21616 0.45814 0.8622
vn 0.21616 0.45814 0.8622
vn -0.13883 0.34861 0.92693
vn -0.13883 0.34861 0.92693
vn -0.13883 0.34861 0.92693
vn -0.3988 -0.09299 0.91231
vn -0.3988 -0.09299 0.91231
vn -0.3988 -0.09299 0.91231
vn -0.46403 -0.33745 0.81902
vn -0.46403 -0.33745 0.81902
vn -0.46403 -0.33745 0.81902
vn -0.22166 -0.3739 0.90059
vn -0.22166 -0.3739 0.90059
vn -0.22166 -0.3739 0.90059
vn 0.17529 0.74181 0.64729
vn 0.17529 0.74181 0.64729
vn 0.17529 0.74181 0.64729
vn 0.17529 0.74181 0.64729
vn -0.51027 0.38941 0.7668
vn -0.51027 0.38941 0.7668
vn -0.51027 0.38941 0.7668
vn -0.51027 0.38941 0.7668
vn -0.57774 -0.3191 0.75126
vn -0.57774 -0.3191 0.75126
vn -0.57774 -0.3191 0.75126
vn -0.57774 -0.3191 0.75126
vn -0.43425 -0.50086 0.74871
vn -0.43425 -0.50086 0.74871
vn -0.43425 -0.50086 0.74871
vn -0.43425 -0.50086 0.74871
vn 0.50595 0.80004 0.32242
vn 0.50595 0.80004 0.32242
vn 0.50595 0.80004 0.32242
vn 0.15429 0.7647 0.62564
vn 0.15429 0.7647 0.62564
vn 0.15429 0.7647 0.62564
vn -0.16172 0.83356 0.52823
vn -0.16172 0.83356 0.52823
vn -0.16172 0.83356 0.52823
vn -0.40876 0.67632 0.61279
vn -0.40876 0.67632 0.61279
vn -0.40876 0.67632 0.61279
vn -0.67024 0.28887 0.68362
vn -0.67024 0.28887 0.68362
vn -0.67024 0.28887 0.68362
vn -0.78041 -0.0893 0.61886
vn -0.78041 -0.0893 0.61886
vn -0.78041 -0.0893 0.61886
vn -0.70384 -0.24455 0.66694
vn -0.70384 -0.24455 0.66694
vn -0.70384 -0.24455 0.66694
vn -0.60385 -0.4886 0.62979
vn -0.60385 -0.4886 0.62979
vn -0.60385 -0.4886 0.62979
vn -0.42264 -0.53525 0.73136
vn -0.42264 -0.53525 0.73136
vn -0.42264 -0.53525 0.73136
vn 0 -0.50628 0.86237
vn 0 -0.50628 0.86237
vn 0 -0.50628 0.86237
vn 0 -0.50628 0.86237
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
vn 0.21616 0.45814 -0.8622
vn 0.21616 0.45814 -0.8622
vn 0.21616 0.45814 -0.8622
vn -0.13883 0.34861 -0.92693
vn -0.13883 0.34861 -0.92693
vn -0.13883 0.34861 -0.92693
vn -0.3988 -0.09299 -0.91231
vn -0.3988 -0.09299 -0.91231
vn -0.3988 -0.09299 -0.91231
vn -0.46403 -0.33745 -0.81902
vn -0.46403 -0.33745 -0.81902
vn -0.46403 -0.33745 -0.81902
vn -0.22166 -0.3739 -0.90059
vn -0.22166 -0.3739 -0.90059
vn -0.22166 -0.3739 -0.90059
vn 0.17529 0.74181 -0.64729
vn 0.17529 0.74181 -0.64729
vn 0.17529 0.74181 -0.64729
vn 0.17529 0.74181 -0.64729
vn -0.51027 0.38941 -0.7668
vn -0.51027 0.38941 -0.7668
vn -0.51027 0.38941 -0.7668
vn -0.51027 0.38941 -0.7668
vn -0.57774 -0.3191 -0.75126
vn -0.57774 -0.3191 -0.75126
vn -0.57774 -0.3191 -0.75126
vn -0.57774 -0.3191 -0.75126
vn -0.43425 -0.50086 -0.74871
vn -0.43425 -0.50086 -0.74871
vn -0.43425 -0.50086 -0.74871
vn -0.43425 -0.50086 -0.74871
vn 0.50595 0.80004 -0.32242
vn 0.50595 0.80004 -0.32242
vn 0.50595 0.80004 -0.32242
vn 0.15429 0.7647 -0.62564
vn 0.15429 0.7647 -0.62564
vn 0.15429 0.7647 -0.62564
vn -0.16172 0.83356 -0.52823
vn -0.16172 0.83356 -0.52823
vn -0.16172 0.83356 -0.52823
vn -0.40876 0.67632 -0.61279
vn -0.40876 0.67632 -0.61279
vn -0.40876 0.67632 -0.61279
vn -0.67024 0.28887 -0.68362
vn -0.67024 0.28887 -0.68362
vn -0.67024 0.28887 -0.68362
vn -0.78041 -0.0893 -0.61886
vn -0.78041 -0.0893 -0.61886
vn -0.78041 -0.0893 -0.61886
vn -0.70384 -0.24455 -0.66694
vn -0.70384 -0.24455 -0.66694
vn -0.70384 -0.24455 -0.66694
vn -0.60385 -0.4886 -0.62979
vn -0.60385 -0.4886 -0.62979
vn -0.60385 -0.4886 -0.62979
vn -0.42264 -0.53525 -0.73136
vn -0.42264 -0.53525 -0.73136
vn -0.42264 -0.53525 -0.73136
vn -0.21616 0.45814 -0.8622
vn -0.21616 0.45814 -0.8622
vn -0.21616 0.45814 -0.8622
vn 0.13883 0.34861 -0.92693
vn 0.13883 0.34861 -0.92693
vn 0.13883 0.34861 -0.92693
vn 0.3988 -0.09299 -0.91231
vn 0.3988 -0.09299 -0.91231
vn 0.3988 -0.09299 -0.91231
vn 0.46403 -0.33745 -0.81902
vn 0.46403 -0.33745 -0.81902
vn 0.46403 -0.33745 -0.81902
vn 0.22166 -0.3739 -0.90059
vn 0.22166 -0.3739 -0.90059
vn 0.22166 -0.3739 -0.90059
vn -0.17529 0.74181 -0.64729
vn -0.17529 0.74181 -0.64729
vn -0.17529 0.74181 -0.64729
vn -0.17529 0.74181 -0.64729
vn 0.51027 0.38941 -0.7668
vn 0.51027 0.38941 -0.7668
vn 0.51027 0.38941 -0.7668
vn 0.51027 0.38941 -0.7668
vn 0.57774 -0.3191 -0.75126
vn 0.57774 -0.3191 -0.75126
vn 0.57774 -0.3191 -0.75126
vn 0.57774 -0.3191 -0.75126
vn 0.43425 -0.50086 -0.74871
vn 0.43425 -0.50086 -0.74871
vn 0.43425 -0.50086 -0.74871
vn 0.43425 -0.50086 -0.74871
vn -0.50595 0.80004 -0.32242
vn -0.50595 0.80004 -0.32242
vn -0.50595 0.80004 -0.32242
vn -0.15429 0.7647 -0.62564
vn -0.15429 0.7647 -0.62564
vn -0.15429 0.7647 -0.62564
vn 0.16172 0.83356 -0.52823
vn 0.16172 0.83356 -0.52823
vn 0.16172 0.83356 -0.52823
vn 0.40876 0.67632 -0.61279
vn 0.40876 0.67632 -0.61279
vn 0.40876 0.67632 -0.61279
vn 0.67024 0.28887 -0.68362
vn 0.67024 0.28887 -0.68362
vn 0.67024 0.28887 -0.68362
vn 0.78041 -0.0893 -0.61886
vn 0.78041 -0.0893 -0.61886
vn 0.78041 -0.0893 -0.61886
vn 0.70384 -0.24455 -0.66694
vn 0.70384 -0.24455 -0.66694
vn 0.70384 -0.24455 -0.66694
vn 0.60385 -0.4886 -0.62979
vn 0.60385 -0.4886 -0.62979
vn 0.60385 -0.4886 -0.62979
vn 0.42264 -0.53525 -0.73136
vn 0.42264 -0.53525 -0.73136
vn 0.42264 -0.53525 -0.73136
vn 0 -0.50628 -0.86237
vn 0 -0.50628 -0.86237
vn 0 -0.50628 -0.86237
vn 0 -0.50628 -0.86237
f 1 3 2
f 1 4 3
f 1 5 4
f 1 6 5
f 1 7 6
f 1 8 7
f 1 9 8
f 1 10 9
f 11 12 13
f 14 15 16
f 17 18 19
f 20 21 22
f 23 24 25
f 26 28 27
f 27 28 29
f 30 32 31
f 31 32 33
f 34 36 35
f 35 36 37
f 38 40 39
f 39 40 41
f 42 43 44
f 45 46 47
f 48 49 50
f 51 52 53
f 54 55 56
f 57 58 59
f 60 61 62
f 63 64 65
f 66 67 68
f 69 71 70
f 72 74 73
f 75 77 76
f 78 80 79
f 81 83 82
f 84 85 86
f 86 85 87
f 88 89 90
f 90 89 91
f 92 93 94
f 94 93 95
f 96 97 98
f 98 97 99
f 101 100 102
f 104 103 105
f 107 106 108
f 110 109 111
f 113 112 114
f 116 115 117
f 119 118 120
f 122 121 123
f 125 124 126
f 127 128 129
f 129 128 130
f 131 133 132
f 131 134 133
f 131 135 134
f 131 136 135
f 131 137 136
f 131 138 137
f 131 139 138
f 131 140 139
f 141 142 143
f 144 145 146
f 147 148 149
f 150 151 152
f 153 154 155
f 156 158 157
f 157 158 159
f 160 162 161
f 161 162 163
f 164 166 165
f 165 166 167
f 168 170 169
f 169 170 171
f 172 173 174
f 175 176 177
f 178 179 180
f 181 182 183
f 184 185 186
f 187 188 189
f 190 191 192
f 193 194 195
f 196 197 198
f 199 201 200
f 202 204 203
f 205 207 206
f 208 210 209
f 211 213 212
f 214 215 216
f 216 215 217
f 218 219 220
f 220 219 221
f 222 223 224
f 224 223 225
f 226 227 228
f 228 227 229
f 231 230 232
f 234 233 235
f 237 236 238
f 240 239 241
f 243 242 244
f 246 245 247
f 249 248 250
f 252 251 253
f 255 254 256
f 257 258 259
f 259 258 260`
assets["objs/marquise.obj"]=`v 0 0 0.22045
v 0 0.50102 0.22045
v 0.12436 0.37782 0.22045
v 0.17418 0 0.22045
v 0.12436 -0.37782 0.22045
v 0 -0.50102 0.22045
v -0.12436 -0.37782 0.22045
v -0.17418 0 0.22045
v -0.12436 0.37782 0.22045
v 0 0.50102 0.22045
v 0.12436 0.37782 0.22045
v 0.06894 0.65325 0.15319
v 0.12436 0.37782 0.22045
v 0.17418 0 0.22045
v 0.23947 0.28571 0.15319
v 0.17418 0 0.22045
v 0.12436 -0.37782 0.22045
v 0.23947 -0.28571 0.15319
v 0.12436 -0.37782 0.22045
v 0 -0.50102 0.22045
v 0.06894 -0.65325 0.15319
v 0 -0.50102 0.22045
v -0.12436 -0.37782 0.22045
v -0.06894 -0.65325 0.15319
v -0.12436 -0.37782 0.22045
v -0.17418 0 0.22045
v -0.23947 -0.28571 0.15319
v -0.17418 0 0.22045
v -0.12436 0.37782 0.22045
v -0.23947 0.28571 0.15319
v -0.12436 0.37782 0.22045
v 0 0.50102 0.22045
v -0.06894 0.65325 0.15319
v 0 1 0
v 0 0.50102 0.22045
v 0.06894 0.65325 0.15319
v 0 1 0
v -0.06894 0.65325 0.15319
v 0 0.50102 0.22045
v 0.28984 0.53241 0
v 0.12436 0.37782 0.22045
v 0.23947 0.28571 0.15319
v 0.28984 0.53241 0
v 0.06894 0.65325 0.15319
v 0.12436 0.37782 0.22045
v 0.38817 0 0
v 0.17418 0 0.22045
v 0.23947 -0.28571 0.15319
v 0.38817 0 0
v 0.23947 0.28571 0.15319
v 0.17418 0 0.22045
v 0.28984 -0.53241 0
v 0.12436 -0.37782 0.22045
v 0.06894 -0.65325 0.15319
v 0.28984 -0.53241 0
v 0.23947 -0.28571 0.15319
v 0.12436 -0.37782 0.22045
v 0 -1 0
v 0 -0.50102 0.22045
v -0.06894 -0.65325 0.15319
v 0 -1 0
v 0.06894 -0.65325 0.15319
v 0 -0.50102 0.22045
v -0.28984 -0.53241 0
v -0.12436 -0.37782 0.22045
v -0.23947 -0.28571 0.15319
v -0.28984 -0.53241 0
v -0.06894 -0.65325 0.15319
v -0.12436 -0.37782 0.22045
v -0.38817 0 0
v -0.17418 0 0.22045
v -0.23947 0.28571 0.15319
v -0.38817 0 0
v -0.23947 -0.28571 0.15319
v -0.17418 0 0.22045
v -0.28984 0.53241 0
v -0.12436 0.37782 0.22045
v -0.06894 0.65325 0.15319
v -0.28984 0.53241 0
v -0.23947 0.28571 0.15319
v -0.12436 0.37782 0.22045
v 0.06894 0.65325 0.15319
v 0.28984 0.53241 0
v 0 1 0
v 0.23947 0.28571 0.15319
v 0.38817 0 0
v 0.28984 0.53241 0
v 0.23947 -0.28571 0.15319
v 0.28984 -0.53241 0
v 0.38817 0 0
v 0.06894 -0.65325 0.15319
v 0 -1 0
v 0.28984 -0.53241 0
v -0.06894 -0.65325 0.15319
v -0.28984 -0.53241 0
v 0 -1 0
v -0.23947 -0.28571 0.15319
v -0.38817 0 0
v -0.28984 -0.53241 0
v -0.23947 0.28571 0.15319
v -0.28984 0.53241 0
v -0.38817 0 0
v -0.06894 0.65325 0.15319
v 0 1 0
v -0.28984 0.53241 0
v 0 0 -0.22045
v 0 0.50102 -0.22045
v -0.12436 0.37782 -0.22045
v -0.17418 0 -0.22045
v -0.12436 -0.37782 -0.22045
v 0 -0.50102 -0.22045
v 0.12436 -0.37782 -0.22045
v 0.17418 0 -0.22045
v 0.12436 0.37782 -0.22045
v 0 0.50102 -0.22045
v -0.12436 0.37782 -0.22045
v -0.06894 0.65325 -0.15319
v -0.12436 0.37782 -0.22045
v -0.17418 0 -0.22045
v -0.23947 0.28571 -0.15319
v -0.17418 0 -0.22045
v -0.12436 -0.37782 -0.22045
v -0.23947 -0.28571 -0.15319
v -0.12436 -0.37782 -0.22045
v 0 -0.50102 -0.22045
v -0.06894 -0.65325 -0.15319
v 0 -0.50102 -0.22045
v 0.12436 -0.37782 -0.22045
v 0.06894 -0.65325 -0.15319
v 0.12436 -0.37782 -0.22045
v 0.17418 0 -0.22045
v 0.23947 -0.28571 -0.15319
v 0.17418 0 -0.22045
v 0.12436 0.37782 -0.22045
v 0.23947 0.28571 -0.15319
v 0.12436 0.37782 -0.22045
v 0 0.50102 -0.22045
v 0.06894 0.65325 -0.15319
v 0 1 0
v 0 0.50102 -0.22045
v -0.06894 0.65325 -0.15319
v 0 1 0
v 0.06894 0.65325 -0.15319
v 0 0.50102 -0.22045
v -0.28984 0.53241 0
v -0.12436 0.37782 -0.22045
v -0.23947 0.28571 -0.15319
v -0.28984 0.53241 0
v -0.06894 0.65325 -0.15319
v -0.12436 0.37782 -0.22045
v -0.38817 0 0
v -0.17418 0 -0.22045
v -0.23947 -0.28571 -0.15319
v -0.38817 0 0
v -0.23947 0.28571 -0.15319
v -0.17418 0 -0.22045
v -0.28984 -0.53241 0
v -0.12436 -0.37782 -0.22045
v -0.06894 -0.65325 -0.15319
v -0.28984 -0.53241 0
v -0.23947 -0.28571 -0.15319
v -0.12436 -0.37782 -0.22045
v 0 -1 0
v 0 -0.50102 -0.22045
v 0.06894 -0.65325 -0.15319
v 0 -1 0
v -0.06894 -0.65325 -0.15319
v 0 -0.50102 -0.22045
v 0.28984 -0.53241 0
v 0.12436 -0.37782 -0.22045
v 0.23947 -0.28571 -0.15319
v 0.28984 -0.53241 0
v 0.06894 -0.65325 -0.15319
v 0.12436 -0.37782 -0.22045
v 0.38817 0 0
v 0.17418 0 -0.22045
v 0.23947 0.28571 -0.15319
v 0.38817 0 0
v 0.23947 -0.28571 -0.15319
v 0.17418 0 -0.22045
v 0.28984 0.53241 0
v 0.12436 0.37782 -0.22045
v 0.06894 0.65325 -0.15319
v 0.28984 0.53241 0
v 0.23947 0.28571 -0.15319
v 0.12436 0.37782 -0.22045
v -0.06894 0.65325 -0.15319
v -0.28984 0.53241 0
v 0 1 0
v -0.23947 0.28571 -0.15319
v -0.38817 0 0
v -0.28984 0.53241 0
v -0.23947 -0.28571 -0.15319
v -0.28984 -0.53241 0
v -0.38817 0 0
v -0.06894 -0.65325 -0.15319
v 0 -1 0
v -0.28984 -0.53241 0
v 0.06894 -0.65325 -0.15319
v 0.28984 -0.53241 0
v 0 -1 0
v 0.23947 -0.28571 -0.15319
v 0.38817 0 0
v 0.28984 -0.53241 0
v 0.23947 0.28571 -0.15319
v 0.28984 0.53241 0
v 0.38817 0 0
v 0.06894 0.65325 -0.15319
v 0 1 0
v 0.28984 0.53241 0
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0.27762 0.28024 0.91891
vn 0.27762 0.28024 0.91891
vn 0.27762 0.28024 0.91891
vn 0.54548 0.07192 0.83504
vn 0.54548 0.07192 0.83504
vn 0.54548 0.07192 0.83504
vn 0.54548 -0.07192 0.83504
vn 0.54548 -0.07192 0.83504
vn 0.54548 -0.07192 0.83504
vn 0.27762 -0.28024 0.91891
vn 0.27762 -0.28024 0.91891
vn 0.27762 -0.28024 0.91891
vn -0.27762 -0.28024 0.91891
vn -0.27762 -0.28024 0.91891
vn -0.27762 -0.28024 0.91891
vn -0.54548 -0.07192 0.83504
vn -0.54548 -0.07192 0.83504
vn -0.54548 -0.07192 0.83504
vn -0.54548 0.07192 0.83504
vn -0.54548 0.07192 0.83504
vn -0.54548 0.07192 0.83504
vn -0.27762 0.28024 0.91891
vn -0.27762 0.28024 0.91891
vn -0.27762 0.28024 0.91891
vn 0 0.40412 0.91471
vn 0 0.40412 0.91471
vn 0 0.40412 0.91471
vn 0 0.40412 0.91471
vn 0 0.40412 0.91471
vn 0 0.40412 0.91471
vn 0.64916 0.30118 0.69849
vn 0.64916 0.30118 0.69849
vn 0.64916 0.30118 0.69849
vn 0.64916 0.30118 0.69849
vn 0.64916 0.30118 0.69849
vn 0.64916 0.30118 0.69849
vn 0.71753 0 0.69653
vn 0.71753 0 0.69653
vn 0.71753 0 0.69653
vn 0.71753 0 0.69653
vn 0.71753 0 0.69653
vn 0.71753 0 0.69653
vn 0.64916 -0.30118 0.69849
vn 0.64916 -0.30118 0.69849
vn 0.64916 -0.30118 0.69849
vn 0.64916 -0.30118 0.69849
vn 0.64916 -0.30118 0.69849
vn 0.64916 -0.30118 0.69849
vn 0 -0.40412 0.91471
vn 0 -0.40412 0.91471
vn 0 -0.40412 0.91471
vn 0 -0.40412 0.91471
vn 0 -0.40412 0.91471
vn 0 -0.40412 0.91471
vn -0.64916 -0.30118 0.69849
vn -0.64916 -0.30118 0.69849
vn -0.64916 -0.30118 0.69849
vn -0.64916 -0.30118 0.69849
vn -0.64916 -0.30118 0.69849
vn -0.64916 -0.30118 0.69849
vn -0.71753 0 0.69653
vn -0.71753 0 0.69653
vn -0.71753 0 0.69653
vn -0.71753 0 0.69653
vn -0.71753 0 0.69653
vn -0.71753 0 0.69653
vn -0.64916 0.30118 0.69849
vn -0.64916 0.30118 0.69849
vn -0.64916 0.30118 0.69849
vn -0.64916 0.30118 0.69849
vn -0.64916 0.30118 0.69849
vn -0.64916 0.30118 0.69849
vn 0.66046 0.4094 0.62943
vn 0.66046 0.4094 0.62943
vn 0.66046 0.4094 0.62943
vn 0.83732 0.15465 0.52439
vn 0.83732 0.15465 0.52439
vn 0.83732 0.15465 0.52439
vn 0.83732 -0.15465 0.52439
vn 0.83732 -0.15465 0.52439
vn 0.83732 -0.15465 0.52439
vn 0.66046 -0.4094 0.62943
vn 0.66046 -0.4094 0.62943
vn 0.66046 -0.4094 0.62943
vn -0.66046 -0.4094 0.62943
vn -0.66046 -0.4094 0.62943
vn -0.66046 -0.4094 0.62943
vn -0.83732 -0.15465 0.52439
vn -0.83732 -0.15465 0.52439
vn -0.83732 -0.15465 0.52439
vn -0.83732 0.15465 0.52439
vn -0.83732 0.15465 0.52439
vn -0.83732 0.15465 0.52439
vn -0.66046 0.4094 0.62943
vn -0.66046 0.4094 0.62943
vn -0.66046 0.4094 0.62943
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
vn -0.27762 0.28024 -0.91891
vn -0.27762 0.28024 -0.91891
vn -0.27762 0.28024 -0.91891
vn -0.54548 0.07192 -0.83504
vn -0.54548 0.07192 -0.83504
vn -0.54548 0.07192 -0.83504
vn -0.54548 -0.07192 -0.83504
vn -0.54548 -0.07192 -0.83504
vn -0.54548 -0.07192 -0.83504
vn -0.27762 -0.28024 -0.91891
vn -0.27762 -0.28024 -0.91891
vn -0.27762 -0.28024 -0.91891
vn 0.27762 -0.28024 -0.91891
vn 0.27762 -0.28024 -0.91891
vn 0.27762 -0.28024 -0.91891
vn 0.54548 -0.07192 -0.83504
vn 0.54548 -0.07192 -0.83504
vn 0.54548 -0.07192 -0.83504
vn 0.54548 0.07192 -0.83504
vn 0.54548 0.07192 -0.83504
vn 0.54548 0.07192 -0.83504
vn 0.27762 0.28024 -0.91891
vn 0.27762 0.28024 -0.91891
vn 0.27762 0.28024 -0.91891
vn 0 0.40412 -0.91471
vn 0 0.40412 -0.91471
vn 0 0.40412 -0.91471
vn 0 0.40412 -0.91471
vn 0 0.40412 -0.91471
vn 0 0.40412 -0.91471
vn -0.64916 0.30118 -0.69849
vn -0.64916 0.30118 -0.69849
vn -0.64916 0.30118 -0.69849
vn -0.64916 0.30118 -0.69849
vn -0.64916 0.30118 -0.69849
vn -0.64916 0.30118 -0.69849
vn -0.71753 0 -0.69653
vn -0.71753 0 -0.69653
vn -0.71753 0 -0.69653
vn -0.71753 0 -0.69653
vn -0.71753 0 -0.69653
vn -0.71753 0 -0.69653
vn -0.64916 -0.30118 -0.69849
vn -0.64916 -0.30118 -0.69849
vn -0.64916 -0.30118 -0.69849
vn -0.64916 -0.30118 -0.69849
vn -0.64916 -0.30118 -0.69849
vn -0.64916 -0.30118 -0.69849
vn 0 -0.40412 -0.91471
vn 0 -0.40412 -0.91471
vn 0 -0.40412 -0.91471
vn 0 -0.40412 -0.91471
vn 0 -0.40412 -0.91471
vn 0 -0.40412 -0.91471
vn 0.64916 -0.30118 -0.69849
vn 0.64916 -0.30118 -0.69849
vn 0.64916 -0.30118 -0.69849
vn 0.64916 -0.30118 -0.69849
vn 0.64916 -0.30118 -0.69849
vn 0.64916 -0.30118 -0.69849
vn 0.71753 0 -0.69653
vn 0.71753 0 -0.69653
vn 0.71753 0 -0.69653
vn 0.71753 0 -0.69653
vn 0.71753 0 -0.69653
vn 0.71753 0 -0.69653
vn 0.64916 0.30118 -0.69849
vn 0.64916 0.30118 -0.69849
vn 0.64916 0.30118 -0.69849
vn 0.64916 0.30118 -0.69849
vn 0.64916 0.30118 -0.69849
vn 0.64916 0.30118 -0.69849
vn -0.66046 0.4094 -0.62943
vn -0.66046 0.4094 -0.62943
vn -0.66046 0.4094 -0.62943
vn -0.83732 0.15465 -0.52439
vn -0.83732 0.15465 -0.52439
vn -0.83732 0.15465 -0.52439
vn -0.83732 -0.15465 -0.52439
vn -0.83732 -0.15465 -0.52439
vn -0.83732 -0.15465 -0.52439
vn -0.66046 -0.4094 -0.62943
vn -0.66046 -0.4094 -0.62943
vn -0.66046 -0.4094 -0.62943
vn 0.66046 -0.4094 -0.62943
vn 0.66046 -0.4094 -0.62943
vn 0.66046 -0.4094 -0.62943
vn 0.83732 -0.15465 -0.52439
vn 0.83732 -0.15465 -0.52439
vn 0.83732 -0.15465 -0.52439
vn 0.83732 0.15465 -0.52439
vn 0.83732 0.15465 -0.52439
vn 0.83732 0.15465 -0.52439
vn 0.66046 0.4094 -0.62943
vn 0.66046 0.4094 -0.62943
vn 0.66046 0.4094 -0.62943
f 1 3 2
f 1 4 3
f 1 5 4
f 1 6 5
f 1 7 6
f 1 8 7
f 1 9 8
f 1 2 9
f 10 11 12
f 13 14 15
f 16 17 18
f 19 20 21
f 22 23 24
f 25 26 27
f 28 29 30
f 31 32 33
f 34 35 36
f 37 38 39
f 40 41 42
f 43 44 45
f 46 47 48
f 49 50 51
f 52 53 54
f 55 56 57
f 58 59 60
f 61 62 63
f 64 65 66
f 67 68 69
f 70 71 72
f 73 74 75
f 76 77 78
f 79 80 81
f 82 83 84
f 85 86 87
f 88 89 90
f 91 92 93
f 94 95 96
f 97 98 99
f 100 101 102
f 103 104 105
f 106 108 107
f 106 109 108
f 106 110 109
f 106 111 110
f 106 112 111
f 106 113 112
f 106 114 113
f 106 107 114
f 115 116 117
f 118 119 120
f 121 122 123
f 124 125 126
f 127 128 129
f 130 131 132
f 133 134 135
f 136 137 138
f 139 140 141
f 142 143 144
f 145 146 147
f 148 149 150
f 151 152 153
f 154 155 156
f 157 158 159
f 160 161 162
f 163 164 165
f 166 167 168
f 169 170 171
f 172 173 174
f 175 176 177
f 178 179 180
f 181 182 183
f 184 185 186
f 187 188 189
f 190 191 192
f 193 194 195
f 196 197 198
f 199 200 201
f 202 203 204
f 205 206 207
f 208 209 210`
assets["objs/rose.obj"]=`v 0.58584 0 0.2897
v 0.29292 0.50735 0.2897
v 0 0 0.44988
v 0.29292 0.50735 0.2897
v -0.29292 0.50735 0.2897
v 0 0 0.44988
v -0.29292 0.50735 0.2897
v -0.58584 0 0.2897
v 0 0 0.44988
v -0.58584 0 0.2897
v -0.29292 -0.50735 0.2897
v 0 0 0.44988
v -0.29292 -0.50735 0.2897
v 0.29292 -0.50735 0.2897
v 0 0 0.44988
v 0.29292 -0.50735 0.2897
v 0.58584 0 0.2897
v 0 0 0.44988
v 0.58584 0 0.2897
v 0.81406 0.47 0
v 0.29292 0.50735 0.2897
v 0.29292 0.50735 0.2897
v 0 0.94 0
v -0.29292 0.50735 0.2897
v -0.29292 0.50735 0.2897
v -0.81406 0.47 0
v -0.58584 0 0.2897
v -0.58584 0 0.2897
v -0.81406 -0.47 0
v -0.29292 -0.50735 0.2897
v -0.29292 -0.50735 0.2897
v 0 -0.94 0
v 0.29292 -0.50735 0.2897
v 0.29292 -0.50735 0.2897
v 0.81406 -0.47 0
v 0.58584 0 0.2897
v 0.81406 0.47 0
v 0.58584 0 0.2897
v 0.94 0 0
v 0.58584 0 0.2897
v 0.81406 -0.47 0
v 0.94 0 0
v 0 0.94 0
v 0.29292 0.50735 0.2897
v 0.47 0.81406 0
v 0.29292 0.50735 0.2897
v 0.81406 0.47 0
v 0.47 0.81406 0
v -0.81406 0.47 0
v -0.29292 0.50735 0.2897
v -0.47 0.81406 0
v -0.29292 0.50735 0.2897
v 0 0.94 0
v -0.47 0.81406 0
v -0.81406 -0.47 0
v -0.58584 0 0.2897
v -0.94 0 0
v -0.58584 0 0.2897
v -0.81406 0.47 0
v -0.94 0 0
v 0 -0.94 0
v -0.29292 -0.50735 0.2897
v -0.47 -0.81406 0
v -0.29292 -0.50735 0.2897
v -0.81406 -0.47 0
v -0.47 -0.81406 0
v 0.81406 -0.47 0
v 0.29292 -0.50735 0.2897
v 0.47 -0.81406 0
v 0.29292 -0.50735 0.2897
v 0 -0.94 0
v 0.47 -0.81406 0
v -0.58584 0 -0.2897
v -0.29292 0.50735 -0.2897
v 0 0 -0.44988
v -0.29292 0.50735 -0.2897
v 0.29292 0.50735 -0.2897
v 0 0 -0.44988
v 0.29292 0.50735 -0.2897
v 0.58584 0 -0.2897
v 0 0 -0.44988
v 0.58584 0 -0.2897
v 0.29292 -0.50735 -0.2897
v 0 0 -0.44988
v 0.29292 -0.50735 -0.2897
v -0.29292 -0.50735 -0.2897
v 0 0 -0.44988
v -0.29292 -0.50735 -0.2897
v -0.58584 0 -0.2897
v 0 0 -0.44988
v -0.58584 0 -0.2897
v -0.81406 0.47 0
v -0.29292 0.50735 -0.2897
v -0.29292 0.50735 -0.2897
v 0 0.94 0
v 0.29292 0.50735 -0.2897
v 0.29292 0.50735 -0.2897
v 0.81406 0.47 0
v 0.58584 0 -0.2897
v 0.58584 0 -0.2897
v 0.81406 -0.47 0
v 0.29292 -0.50735 -0.2897
v 0.29292 -0.50735 -0.2897
v 0 -0.94 0
v -0.29292 -0.50735 -0.2897
v -0.29292 -0.50735 -0.2897
v -0.81406 -0.47 0
v -0.58584 0 -0.2897
v -0.81406 0.47 0
v -0.58584 0 -0.2897
v -0.94 0 0
v -0.58584 0 -0.2897
v -0.81406 -0.47 0
v -0.94 0 0
v 0 0.94 0
v -0.29292 0.50735 -0.2897
v -0.47 0.81406 0
v -0.29292 0.50735 -0.2897
v -0.81406 0.47 0
v -0.47 0.81406 0
v 0.81406 0.47 0
v 0.29292 0.50735 -0.2897
v 0.47 0.81406 0
v 0.29292 0.50735 -0.2897
v 0 0.94 0
v 0.47 0.81406 0
v 0.81406 -0.47 0
v 0.58584 0 -0.2897
v 0.94 0 0
v 0.58584 0 -0.2897
v 0.81406 0.47 0
v 0.94 0 0
v 0 -0.94 0
v 0.29292 -0.50735 -0.2897
v 0.47 -0.81406 0
v 0.29292 -0.50735 -0.2897
v 0.81406 -0.47 0
v 0.47 -0.81406 0
v -0.81406 -0.47 0
v -0.29292 -0.50735 -0.2897
v -0.47 -0.81406 0
v -0.29292 -0.50735 -0.2897
v 0 -0.94 0
v -0.47 -0.81406 0
vn 0.26074 0.15054 0.9536
vn 0.26074 0.15054 0.9536
vn 0.26074 0.15054 0.9536
vn 0 0.30108 0.9536
vn 0 0.30108 0.9536
vn 0 0.30108 0.9536
vn -0.26074 0.15054 0.9536
vn -0.26074 0.15054 0.9536
vn -0.26074 0.15054 0.9536
vn -0.26074 -0.15054 0.9536
vn -0.26074 -0.15054 0.9536
vn -0.26074 -0.15054 0.9536
vn 0 -0.30108 0.9536
vn 0 -0.30108 0.9536
vn 0 -0.30108 0.9536
vn 0.26074 -0.15054 0.9536
vn 0.26074 -0.15054 0.9536
vn 0.26074 -0.15054 0.9536
vn 0.48184 0.27819 0.83093
vn 0.48184 0.27819 0.83093
vn 0.48184 0.27819 0.83093
vn 0 0.55638 0.83093
vn 0 0.55638 0.83093
vn 0 0.55638 0.83093
vn -0.48184 0.27819 0.83093
vn -0.48184 0.27819 0.83093
vn -0.48184 0.27819 0.83093
vn -0.48184 -0.27819 0.83093
vn -0.48184 -0.27819 0.83093
vn -0.48184 -0.27819 0.83093
vn 0 -0.55638 0.83093
vn 0 -0.55638 0.83093
vn 0 -0.55638 0.83093
vn 0.48184 -0.27819 0.83093
vn 0.48184 -0.27819 0.83093
vn 0.48184 -0.27819 0.83093
vn 0.62423 0.16726 0.76313
vn 0.62423 0.16726 0.76313
vn 0.62423 0.16726 0.76313
vn 0.62423 -0.16726 0.76313
vn 0.62423 -0.16726 0.76313
vn 0.62423 -0.16726 0.76313
vn 0.16726 0.62423 0.76313
vn 0.16726 0.62423 0.76313
vn 0.16726 0.62423 0.76313
vn 0.45697 0.45697 0.76313
vn 0.45697 0.45697 0.76313
vn 0.45697 0.45697 0.76313
vn -0.45697 0.45697 0.76313
vn -0.45697 0.45697 0.76313
vn -0.45697 0.45697 0.76313
vn -0.16726 0.62423 0.76313
vn -0.16726 0.62423 0.76313
vn -0.16726 0.62423 0.76313
vn -0.62423 -0.16726 0.76313
vn -0.62423 -0.16726 0.76313
vn -0.62423 -0.16726 0.76313
vn -0.62423 0.16726 0.76313
vn -0.62423 0.16726 0.76313
vn -0.62423 0.16726 0.76313
vn -0.16726 -0.62423 0.76313
vn -0.16726 -0.62423 0.76313
vn -0.16726 -0.62423 0.76313
vn -0.45697 -0.45697 0.76313
vn -0.45697 -0.45697 0.76313
vn -0.45697 -0.45697 0.76313
vn 0.45697 -0.45697 0.76313
vn 0.45697 -0.45697 0.76313
vn 0.45697 -0.45697 0.76313
vn 0.16726 -0.62423 0.76313
vn 0.16726 -0.62423 0.76313
vn 0.16726 -0.62423 0.76313
vn -0.26074 0.15054 -0.9536
vn -0.26074 0.15054 -0.9536
vn -0.26074 0.15054 -0.9536
vn 0 0.30108 -0.9536
vn 0 0.30108 -0.9536
vn 0 0.30108 -0.9536
vn 0.26074 0.15054 -0.9536
vn 0.26074 0.15054 -0.9536
vn 0.26074 0.15054 -0.9536
vn 0.26074 -0.15054 -0.9536
vn 0.26074 -0.15054 -0.9536
vn 0.26074 -0.15054 -0.9536
vn 0 -0.30108 -0.9536
vn 0 -0.30108 -0.9536
vn 0 -0.30108 -0.9536
vn -0.26074 -0.15054 -0.9536
vn -0.26074 -0.15054 -0.9536
vn -0.26074 -0.15054 -0.9536
vn -0.48184 0.27819 -0.83093
vn -0.48184 0.27819 -0.83093
vn -0.48184 0.27819 -0.83093
vn 0 0.55638 -0.83093
vn 0 0.55638 -0.83093
vn 0 0.55638 -0.83093
vn 0.48184 0.27819 -0.83093
vn 0.48184 0.27819 -0.83093
vn 0.48184 0.27819 -0.83093
vn 0.48184 -0.27819 -0.83093
vn 0.48184 -0.27819 -0.83093
vn 0.48184 -0.27819 -0.83093
vn 0 -0.55638 -0.83093
vn 0 -0.55638 -0.83093
vn 0 -0.55638 -0.83093
vn -0.48184 -0.27819 -0.83093
vn -0.48184 -0.27819 -0.83093
vn -0.48184 -0.27819 -0.83093
vn -0.62423 0.16726 -0.76313
vn -0.62423 0.16726 -0.76313
vn -0.62423 0.16726 -0.76313
vn -0.62423 -0.16726 -0.76313
vn -0.62423 -0.16726 -0.76313
vn -0.62423 -0.16726 -0.76313
vn -0.16726 0.62423 -0.76313
vn -0.16726 0.62423 -0.76313
vn -0.16726 0.62423 -0.76313
vn -0.45697 0.45697 -0.76313
vn -0.45697 0.45697 -0.76313
vn -0.45697 0.45697 -0.76313
vn 0.45697 0.45697 -0.76313
vn 0.45697 0.45697 -0.76313
vn 0.45697 0.45697 -0.76313
vn 0.16726 0.62423 -0.76313
vn 0.16726 0.62423 -0.76313
vn 0.16726 0.62423 -0.76313
vn 0.62423 -0.16726 -0.76313
vn 0.62423 -0.16726 -0.76313
vn 0.62423 -0.16726 -0.76313
vn 0.62423 0.16726 -0.76313
vn 0.62423 0.16726 -0.76313
vn 0.62423 0.16726 -0.76313
vn 0.16726 -0.62423 -0.76313
vn 0.16726 -0.62423 -0.76313
vn 0.16726 -0.62423 -0.76313
vn 0.45697 -0.45697 -0.76313
vn 0.45697 -0.45697 -0.76313
vn 0.45697 -0.45697 -0.76313
vn -0.45697 -0.45697 -0.76313
vn -0.45697 -0.45697 -0.76313
vn -0.45697 -0.45697 -0.76313
vn -0.16726 -0.62423 -0.76313
vn -0.16726 -0.62423 -0.76313
vn -0.16726 -0.62423 -0.76313
f 1 2 3
f 4 5 6
f 7 8 9
f 10 11 12
f 13 14 15
f 16 17 18
f 19 20 21
f 22 23 24
f 25 26 27
f 28 29 30
f 31 32 33
f 34 35 36
f 37 38 39
f 40 41 42
f 43 44 45
f 46 47 48
f 49 50 51
f 52 53 54
f 55 56 57
f 58 59 60
f 61 62 63
f 64 65 66
f 67 68 69
f 70 71 72
f 73 74 75
f 76 77 78
f 79 80 81
f 82 83 84
f 85 86 87
f 88 89 90
f 91 92 93
f 94 95 96
f 97 98 99
f 100 101 102
f 103 104 105
f 106 107 108
f 109 110 111
f 112 113 114
f 115 116 117
f 118 119 120
f 121 122 123
f 124 125 126
f 127 128 129
f 130 131 132
f 133 134 135
f 136 137 138
f 139 140 141
f 142 143 144`
assets["objs/briolette.obj"]=`v 0 0 -0.99
v 0.21128 0 -0.89408
v 0.16185 0.13581 -0.89408
v 0.28741 0.10461 -0.84223
v 0 0 -0.99
v 0.16185 0.13581 -0.89408
v 0.03669 0.20807 -0.89408
v 0.15293 0.26488 -0.84223
v 0 0 -0.99
v 0.03669 0.20807 -0.89408
v -0.10564 0.18297 -0.89408
v -0.05311 0.30121 -0.84223
v 0 0 -0.99
v -0.10564 0.18297 -0.89408
v -0.19853 0.07226 -0.89408
v -0.2343 0.1966 -0.84223
v 0 0 -0.99
v -0.19853 0.07226 -0.89408
v -0.19853 -0.07226 -0.89408
v -0.30586 0 -0.84223
v 0 0 -0.99
v -0.19853 -0.07226 -0.89408
v -0.10564 -0.18297 -0.89408
v -0.2343 -0.1966 -0.84223
v 0 0 -0.99
v -0.10564 -0.18297 -0.89408
v 0.03669 -0.20807 -0.89408
v -0.05311 -0.30121 -0.84223
v 0 0 -0.99
v 0.03669 -0.20807 -0.89408
v 0.16185 -0.13581 -0.89408
v 0.15293 -0.26488 -0.84223
v 0 0 -0.99
v 0.16185 -0.13581 -0.89408
v 0.21128 0 -0.89408
v 0.28741 -0.10461 -0.84223
v 0.16185 0.13581 -0.89408
v 0.28741 0.10461 -0.84223
v 0.15293 0.26488 -0.84223
v 0.29146 0.24457 -0.77885
v 0.03669 0.20807 -0.89408
v 0.15293 0.26488 -0.84223
v -0.05311 0.30121 -0.84223
v 0.06607 0.3747 -0.77885
v -0.10564 0.18297 -0.89408
v -0.05311 0.30121 -0.84223
v -0.2343 0.1966 -0.84223
v -0.19024 0.3295 -0.77885
v -0.19853 0.07226 -0.89408
v -0.2343 0.1966 -0.84223
v -0.30586 0 -0.84223
v -0.35753 0.13013 -0.77885
v -0.19853 -0.07226 -0.89408
v -0.30586 0 -0.84223
v -0.2343 -0.1966 -0.84223
v -0.35753 -0.13013 -0.77885
v -0.10564 -0.18297 -0.89408
v -0.2343 -0.1966 -0.84223
v -0.05311 -0.30121 -0.84223
v -0.19024 -0.3295 -0.77885
v 0.03669 -0.20807 -0.89408
v -0.05311 -0.30121 -0.84223
v 0.15293 -0.26488 -0.84223
v 0.06607 -0.3747 -0.77885
v 0.16185 -0.13581 -0.89408
v 0.15293 -0.26488 -0.84223
v 0.28741 -0.10461 -0.84223
v 0.29146 -0.24457 -0.77885
v 0.21128 0 -0.89408
v 0.28741 -0.10461 -0.84223
v 0.28741 0.10461 -0.84223
v 0.38048 0 -0.77885
v 0.15293 0.26488 -0.84223
v 0.29146 0.24457 -0.77885
v 0.06607 0.3747 -0.77885
v 0.23915 0.41422 -0.63072
v -0.05311 0.30121 -0.84223
v 0.06607 0.3747 -0.77885
v -0.19024 0.3295 -0.77885
v -0.08306 0.47104 -0.63072
v -0.2343 0.1966 -0.84223
v -0.19024 0.3295 -0.77885
v -0.35753 0.13013 -0.77885
v -0.3664 0.30745 -0.63072
v -0.30586 0 -0.84223
v -0.35753 0.13013 -0.77885
v -0.35753 -0.13013 -0.77885
v -0.4783 0 -0.63072
v -0.2343 -0.1966 -0.84223
v -0.35753 -0.13013 -0.77885
v -0.19024 -0.3295 -0.77885
v -0.3664 -0.30745 -0.63072
v -0.05311 -0.30121 -0.84223
v -0.19024 -0.3295 -0.77885
v 0.06607 -0.3747 -0.77885
v -0.08306 -0.47104 -0.63072
v 0.15293 -0.26488 -0.84223
v 0.06607 -0.3747 -0.77885
v 0.29146 -0.24457 -0.77885
v 0.23915 -0.41422 -0.63072
v 0.28741 -0.10461 -0.84223
v 0.29146 -0.24457 -0.77885
v 0.38048 0 -0.77885
v 0.44946 -0.16359 -0.63072
v 0.28741 0.10461 -0.84223
v 0.38048 0 -0.77885
v 0.29146 0.24457 -0.77885
v 0.44946 0.16359 -0.63072
v 0.06607 0.3747 -0.77885
v 0.23915 0.41422 -0.63072
v -0.08306 0.47104 -0.63072
v 0.09467 0.53688 -0.4252
v -0.19024 0.3295 -0.77885
v -0.08306 0.47104 -0.63072
v -0.3664 0.30745 -0.63072
v -0.27258 0.47212 -0.4252
v -0.35753 0.13013 -0.77885
v -0.3664 0.30745 -0.63072
v -0.4783 0 -0.63072
v -0.51228 0.18646 -0.4252
v -0.35753 -0.13013 -0.77885
v -0.4783 0 -0.63072
v -0.3664 -0.30745 -0.63072
v -0.51228 -0.18646 -0.4252
v -0.19024 -0.3295 -0.77885
v -0.3664 -0.30745 -0.63072
v -0.08306 -0.47104 -0.63072
v -0.27258 -0.47212 -0.4252
v 0.06607 -0.3747 -0.77885
v -0.08306 -0.47104 -0.63072
v 0.23915 -0.41422 -0.63072
v 0.09467 -0.53688 -0.4252
v 0.29146 -0.24457 -0.77885
v 0.23915 -0.41422 -0.63072
v 0.44946 -0.16359 -0.63072
v 0.41762 -0.35042 -0.4252
v 0.38048 0 -0.77885
v 0.44946 -0.16359 -0.63072
v 0.44946 0.16359 -0.63072
v 0.54516 0 -0.4252
v 0.29146 0.24457 -0.77885
v 0.44946 0.16359 -0.63072
v 0.23915 0.41422 -0.63072
v 0.41762 0.35042 -0.4252
v -0.08306 0.47104 -0.63072
v 0.09467 0.53688 -0.4252
v -0.27258 0.47212 -0.4252
v -0.09564 0.54239 -0.19249
v -0.3664 0.30745 -0.63072
v -0.27258 0.47212 -0.4252
v -0.51228 0.18646 -0.4252
v -0.42191 0.35402 -0.19249
v -0.4783 0 -0.63072
v -0.51228 0.18646 -0.4252
v -0.51228 -0.18646 -0.4252
v -0.55076 0 -0.19249
v -0.3664 -0.30745 -0.63072
v -0.51228 -0.18646 -0.4252
v -0.27258 -0.47212 -0.4252
v -0.42191 -0.35402 -0.19249
v -0.08306 -0.47104 -0.63072
v -0.27258 -0.47212 -0.4252
v 0.09467 -0.53688 -0.4252
v -0.09564 -0.54239 -0.19249
v 0.23915 -0.41422 -0.63072
v 0.09467 -0.53688 -0.4252
v 0.41762 -0.35042 -0.4252
v 0.27538 -0.47697 -0.19249
v 0.44946 -0.16359 -0.63072
v 0.41762 -0.35042 -0.4252
v 0.54516 0 -0.4252
v 0.51754 -0.18837 -0.19249
v 0.44946 0.16359 -0.63072
v 0.54516 0 -0.4252
v 0.41762 0.35042 -0.4252
v 0.51754 0.18837 -0.19249
v 0.23915 0.41422 -0.63072
v 0.41762 0.35042 -0.4252
v 0.09467 0.53688 -0.4252
v 0.27538 0.47697 -0.19249
v -0.27258 0.47212 -0.4252
v -0.09564 0.54239 -0.19249
v -0.42191 0.35402 -0.19249
v -0.23777 0.41183 0.16147
v -0.51228 0.18646 -0.4252
v -0.42191 0.35402 -0.19249
v -0.55076 0 -0.19249
v -0.44686 0.16264 0.16147
v -0.51228 -0.18646 -0.4252
v -0.55076 0 -0.19249
v -0.42191 -0.35402 -0.19249
v -0.44686 -0.16264 0.16147
v -0.27258 -0.47212 -0.4252
v -0.42191 -0.35402 -0.19249
v -0.09564 -0.54239 -0.19249
v -0.23777 -0.41183 0.16147
v 0.09467 -0.53688 -0.4252
v -0.09564 -0.54239 -0.19249
v 0.27538 -0.47697 -0.19249
v 0.08258 -0.46831 0.16147
v 0.41762 -0.35042 -0.4252
v 0.27538 -0.47697 -0.19249
v 0.51754 -0.18837 -0.19249
v 0.36428 -0.30567 0.16147
v 0.54516 0 -0.4252
v 0.51754 -0.18837 -0.19249
v 0.51754 0.18837 -0.19249
v 0.47554 0 0.16147
v 0.41762 0.35042 -0.4252
v 0.51754 0.18837 -0.19249
v 0.27538 0.47697 -0.19249
v 0.36428 0.30567 0.16147
v 0.09467 0.53688 -0.4252
v 0.27538 0.47697 -0.19249
v -0.09564 0.54239 -0.19249
v 0.08258 0.46831 0.16147
v -0.42191 0.35402 -0.19249
v -0.23777 0.41183 0.16147
v -0.44686 0.16264 0.16147
v -0.28755 0.24129 0.40502
v -0.55076 0 -0.19249
v -0.44686 0.16264 0.16147
v -0.44686 -0.16264 0.16147
v -0.37537 0 0.40502
v -0.42191 -0.35402 -0.19249
v -0.44686 -0.16264 0.16147
v -0.23777 -0.41183 0.16147
v -0.28755 -0.24129 0.40502
v -0.09564 -0.54239 -0.19249
v -0.23777 -0.41183 0.16147
v 0.08258 -0.46831 0.16147
v -0.06518 -0.36967 0.40502
v 0.27538 -0.47697 -0.19249
v 0.08258 -0.46831 0.16147
v 0.36428 -0.30567 0.16147
v 0.18769 -0.32508 0.40502
v 0.51754 -0.18837 -0.19249
v 0.36428 -0.30567 0.16147
v 0.47554 0 0.16147
v 0.35274 -0.12839 0.40502
v 0.51754 0.18837 -0.19249
v 0.47554 0 0.16147
v 0.36428 0.30567 0.16147
v 0.35274 0.12839 0.40502
v 0.27538 0.47697 -0.19249
v 0.36428 0.30567 0.16147
v 0.08258 0.46831 0.16147
v 0.18769 0.32508 0.40502
v -0.09564 0.54239 -0.19249
v 0.08258 0.46831 0.16147
v -0.23777 0.41183 0.16147
v -0.06518 0.36967 0.40502
v -0.44686 0.16264 0.16147
v -0.28755 0.24129 0.40502
v -0.37537 0 0.40502
v -0.20752 0.07553 0.6666
v -0.44686 -0.16264 0.16147
v -0.37537 0 0.40502
v -0.28755 -0.24129 0.40502
v -0.20752 -0.07553 0.6666
v -0.23777 -0.41183 0.16147
v -0.28755 -0.24129 0.40502
v -0.06518 -0.36967 0.40502
v -0.11042 -0.19125 0.6666
v 0.08258 -0.46831 0.16147
v -0.06518 -0.36967 0.40502
v 0.18769 -0.32508 0.40502
v 0.03835 -0.21748 0.6666
v 0.36428 -0.30567 0.16147
v 0.18769 -0.32508 0.40502
v 0.35274 -0.12839 0.40502
v 0.16917 -0.14195 0.6666
v 0.47554 0 0.16147
v 0.35274 -0.12839 0.40502
v 0.35274 0.12839 0.40502
v 0.22084 0 0.6666
v 0.36428 0.30567 0.16147
v 0.35274 0.12839 0.40502
v 0.18769 0.32508 0.40502
v 0.16917 0.14195 0.6666
v 0.08258 0.46831 0.16147
v 0.18769 0.32508 0.40502
v -0.06518 0.36967 0.40502
v 0.03835 0.21748 0.6666
v -0.23777 0.41183 0.16147
v -0.06518 0.36967 0.40502
v -0.28755 0.24129 0.40502
v -0.11042 0.19125 0.6666
v -0.37537 0 0.40502
v -0.20752 0.07553 0.6666
v -0.20752 -0.07553 0.6666
v 0 0 0.99
v -0.28755 -0.24129 0.40502
v -0.20752 -0.07553 0.6666
v -0.11042 -0.19125 0.6666
v 0 0 0.99
v -0.06518 -0.36967 0.40502
v -0.11042 -0.19125 0.6666
v 0.03835 -0.21748 0.6666
v 0 0 0.99
v 0.18769 -0.32508 0.40502
v 0.03835 -0.21748 0.6666
v 0.16917 -0.14195 0.6666
v 0 0 0.99
v 0.35274 -0.12839 0.40502
v 0.16917 -0.14195 0.6666
v 0.22084 0 0.6666
v 0 0 0.99
v 0.35274 0.12839 0.40502
v 0.22084 0 0.6666
v 0.16917 0.14195 0.6666
v 0 0 0.99
v 0.18769 0.32508 0.40502
v 0.16917 0.14195 0.6666
v 0.03835 0.21748 0.6666
v 0 0 0.99
v -0.06518 0.36967 0.40502
v 0.03835 0.21748 0.6666
v -0.11042 0.19125 0.6666
v 0 0 0.99
v -0.28755 0.24129 0.40502
v -0.11042 0.19125 0.6666
v -0.20752 0.07553 0.6666
v 0 0 0.99
vn 0.40879 0.14879 -0.90042
vn 0.40879 0.14879 -0.90042
vn 0.40879 0.14879 -0.90042
vn 0.40879 0.14879 -0.90042
vn 0.21751 0.37674 -0.90042
vn 0.21751 0.37674 -0.90042
vn 0.21751 0.37674 -0.90042
vn 0.21751 0.37674 -0.90042
vn -0.07554 0.42842 -0.90042
vn -0.07554 0.42842 -0.90042
vn -0.07554 0.42842 -0.90042
vn -0.07554 0.42842 -0.90042
vn -0.33325 0.27963 -0.90042
vn -0.33325 0.27963 -0.90042
vn -0.33325 0.27963 -0.90042
vn -0.33325 0.27963 -0.90042
vn -0.43503 0 -0.90042
vn -0.43503 0 -0.90042
vn -0.43503 0 -0.90042
vn -0.43503 0 -0.90042
vn -0.33325 -0.27963 -0.90042
vn -0.33325 -0.27963 -0.90042
vn -0.33325 -0.27963 -0.90042
vn -0.33325 -0.27963 -0.90042
vn -0.07554 -0.42842 -0.90042
vn -0.07554 -0.42842 -0.90042
vn -0.07554 -0.42842 -0.90042
vn -0.07554 -0.42842 -0.90042
vn 0.21751 -0.37674 -0.90042
vn 0.21751 -0.37674 -0.90042
vn 0.21751 -0.37674 -0.90042
vn 0.21751 -0.37674 -0.90042
vn 0.40879 -0.14879 -0.90042
vn 0.40879 -0.14879 -0.90042
vn 0.40879 -0.14879 -0.90042
vn 0.40879 -0.14879 -0.90042
vn 0.43121 0.36182 -0.82653
vn 0.43121 0.36182 -0.82653
vn 0.43121 0.36182 -0.82653
vn 0.43121 0.36182 -0.82653
vn 0.09775 0.55435 -0.82653
vn 0.09775 0.55435 -0.82653
vn 0.09775 0.55435 -0.82653
vn 0.09775 0.55435 -0.82653
vn -0.28145 0.48749 -0.82653
vn -0.28145 0.48749 -0.82653
vn -0.28145 0.48749 -0.82653
vn -0.28145 0.48749 -0.82653
vn -0.52895 0.19252 -0.82653
vn -0.52895 0.19252 -0.82653
vn -0.52895 0.19252 -0.82653
vn -0.52895 0.19252 -0.82653
vn -0.52895 -0.19252 -0.82653
vn -0.52895 -0.19252 -0.82653
vn -0.52895 -0.19252 -0.82653
vn -0.52895 -0.19252 -0.82653
vn -0.28145 -0.48749 -0.82653
vn -0.28145 -0.48749 -0.82653
vn -0.28145 -0.48749 -0.82653
vn -0.28145 -0.48749 -0.82653
vn 0.09775 -0.55435 -0.82653
vn 0.09775 -0.55435 -0.82653
vn 0.09775 -0.55435 -0.82653
vn 0.09775 -0.55435 -0.82653
vn 0.43121 -0.36182 -0.82653
vn 0.43121 -0.36182 -0.82653
vn 0.43121 -0.36182 -0.82653
vn 0.43121 -0.36182 -0.82653
vn 0.5629 0 -0.82653
vn 0.5629 0 -0.82653
vn 0.5629 0 -0.82653
vn 0.5629 0 -0.82653
vn 0.38752 0.67121 -0.6319
vn 0.38752 0.67121 -0.6319
vn 0.38752 0.67121 -0.6319
vn 0.38752 0.67121 -0.6319
vn -0.13459 0.76327 -0.6319
vn -0.13459 0.76327 -0.6319
vn -0.13459 0.76327 -0.6319
vn -0.13459 0.76327 -0.6319
vn -0.59372 0.49819 -0.6319
vn -0.59372 0.49819 -0.6319
vn -0.59372 0.49819 -0.6319
vn -0.59372 0.49819 -0.6319
vn -0.77505 0 -0.6319
vn -0.77505 0 -0.6319
vn -0.77505 0 -0.6319
vn -0.77505 0 -0.6319
vn -0.59372 -0.49819 -0.6319
vn -0.59372 -0.49819 -0.6319
vn -0.59372 -0.49819 -0.6319
vn -0.59372 -0.49819 -0.6319
vn -0.13459 -0.76327 -0.6319
vn -0.13459 -0.76327 -0.6319
vn -0.13459 -0.76327 -0.6319
vn -0.13459 -0.76327 -0.6319
vn 0.38752 -0.67121 -0.6319
vn 0.38752 -0.67121 -0.6319
vn 0.38752 -0.67121 -0.6319
vn 0.38752 -0.67121 -0.6319
vn 0.72831 -0.26508 -0.6319
vn 0.72831 -0.26508 -0.6319
vn 0.72831 -0.26508 -0.6319
vn 0.72831 -0.26508 -0.6319
vn 0.72831 0.26508 -0.6319
vn 0.72831 0.26508 -0.6319
vn 0.72831 0.26508 -0.6319
vn 0.72831 0.26508 -0.6319
vn 0.15742 0.89276 -0.42214
vn 0.15742 0.89276 -0.42214
vn 0.15742 0.89276 -0.42214
vn 0.15742 0.89276 -0.42214
vn -0.45326 0.78508 -0.42214
vn -0.45326 0.78508 -0.42214
vn -0.45326 0.78508 -0.42214
vn -0.45326 0.78508 -0.42214
vn -0.85186 0.31005 -0.42214
vn -0.85186 0.31005 -0.42214
vn -0.85186 0.31005 -0.42214
vn -0.85186 0.31005 -0.42214
vn -0.85186 -0.31005 -0.42214
vn -0.85186 -0.31005 -0.42214
vn -0.85186 -0.31005 -0.42214
vn -0.85186 -0.31005 -0.42214
vn -0.45326 -0.78508 -0.42214
vn -0.45326 -0.78508 -0.42214
vn -0.45326 -0.78508 -0.42214
vn -0.45326 -0.78508 -0.42214
vn 0.15742 -0.89276 -0.42214
vn 0.15742 -0.89276 -0.42214
vn 0.15742 -0.89276 -0.42214
vn 0.15742 -0.89276 -0.42214
vn 0.69444 -0.58271 -0.42214
vn 0.69444 -0.58271 -0.42214
vn 0.69444 -0.58271 -0.42214
vn 0.69444 -0.58271 -0.42214
vn 0.90653 0 -0.42214
vn 0.90653 0 -0.42214
vn 0.90653 0 -0.42214
vn 0.90653 0 -0.42214
vn 0.69444 0.58271 -0.42214
vn 0.69444 0.58271 -0.42214
vn 0.69444 0.58271 -0.42214
vn 0.69444 0.58271 -0.42214
vn -0.17132 0.97162 -0.16313
vn -0.17132 0.97162 -0.16313
vn -0.17132 0.97162 -0.16313
vn -0.17132 0.97162 -0.16313
vn -0.75578 0.63418 -0.16313
vn -0.75578 0.63418 -0.16313
vn -0.75578 0.63418 -0.16313
vn -0.75578 0.63418 -0.16313
vn -0.9866 0 -0.16313
vn -0.9866 0 -0.16313
vn -0.9866 0 -0.16313
vn -0.9866 0 -0.16313
vn -0.75578 -0.63418 -0.16313
vn -0.75578 -0.63418 -0.16313
vn -0.75578 -0.63418 -0.16313
vn -0.75578 -0.63418 -0.16313
vn -0.17132 -0.97162 -0.16313
vn -0.17132 -0.97162 -0.16313
vn -0.17132 -0.97162 -0.16313
vn -0.17132 -0.97162 -0.16313
vn 0.4933 -0.85442 -0.16313
vn 0.4933 -0.85442 -0.16313
vn 0.4933 -0.85442 -0.16313
vn 0.4933 -0.85442 -0.16313
vn 0.92711 -0.33744 -0.16313
vn 0.92711 -0.33744 -0.16313
vn 0.92711 -0.33744 -0.16313
vn 0.92711 -0.33744 -0.16313
vn 0.92711 0.33744 -0.16313
vn 0.92711 0.33744 -0.16313
vn 0.92711 0.33744 -0.16313
vn 0.92711 0.33744 -0.16313
vn 0.4933 0.85442 -0.16313
vn 0.4933 0.85442 -0.16313
vn 0.4933 0.85442 -0.16313
vn 0.4933 0.85442 -0.16313
vn -0.49652 0.85999 0.11784
vn -0.49652 0.85999 0.11784
vn -0.49652 0.85999 0.11784
vn -0.49652 0.85999 0.11784
vn -0.93315 0.33964 0.11784
vn -0.93315 0.33964 0.11784
vn -0.93315 0.33964 0.11784
vn -0.93315 0.33964 0.11784
vn -0.93315 -0.33964 0.11784
vn -0.93315 -0.33964 0.11784
vn -0.93315 -0.33964 0.11784
vn -0.93315 -0.33964 0.11784
vn -0.49652 -0.85999 0.11784
vn -0.49652 -0.85999 0.11784
vn -0.49652 -0.85999 0.11784
vn -0.49652 -0.85999 0.11784
vn 0.17244 -0.97795 0.11784
vn 0.17244 -0.97795 0.11784
vn 0.17244 -0.97795 0.11784
vn 0.17244 -0.97795 0.11784
vn 0.76071 -0.63831 0.11784
vn 0.76071 -0.63831 0.11784
vn 0.76071 -0.63831 0.11784
vn 0.76071 -0.63831 0.11784
vn 0.99303 0 0.11784
vn 0.99303 0 0.11784
vn 0.99303 0 0.11784
vn 0.99303 0 0.11784
vn 0.76071 0.63831 0.11784
vn 0.76071 0.63831 0.11784
vn 0.76071 0.63831 0.11784
vn 0.76071 0.63831 0.11784
vn 0.17244 0.97795 0.11784
vn 0.17244 0.97795 0.11784
vn 0.17244 0.97795 0.11784
vn 0.17244 0.97795 0.11784
vn -0.73503 0.61677 0.28164
vn -0.73503 0.61677 0.28164
vn -0.73503 0.61677 0.28164
vn -0.73503 0.61677 0.28164
vn -0.95952 0 0.28164
vn -0.95952 0 0.28164
vn -0.95952 0 0.28164
vn -0.95952 0 0.28164
vn -0.73503 -0.61677 0.28164
vn -0.73503 -0.61677 0.28164
vn -0.73503 -0.61677 0.28164
vn -0.73503 -0.61677 0.28164
vn -0.16662 -0.94494 0.28164
vn -0.16662 -0.94494 0.28164
vn -0.16662 -0.94494 0.28164
vn -0.16662 -0.94494 0.28164
vn 0.47976 -0.83097 0.28164
vn 0.47976 -0.83097 0.28164
vn 0.47976 -0.83097 0.28164
vn 0.47976 -0.83097 0.28164
vn 0.90165 -0.32817 0.28164
vn 0.90165 -0.32817 0.28164
vn 0.90165 -0.32817 0.28164
vn 0.90165 -0.32817 0.28164
vn 0.90165 0.32817 0.28164
vn 0.90165 0.32817 0.28164
vn 0.90165 0.32817 0.28164
vn 0.90165 0.32817 0.28164
vn 0.47976 0.83097 0.28164
vn 0.47976 0.83097 0.28164
vn 0.47976 0.83097 0.28164
vn 0.47976 0.83097 0.28164
vn -0.16662 0.94494 0.28164
vn -0.16662 0.94494 0.28164
vn -0.16662 0.94494 0.28164
vn -0.16662 0.94494 0.28164
vn -0.83906 0.30539 0.45023
vn -0.83906 0.30539 0.45023
vn -0.83906 0.30539 0.45023
vn -0.83906 0.30539 0.45023
vn -0.83906 -0.30539 0.45023
vn -0.83906 -0.30539 0.45023
vn -0.83906 -0.30539 0.45023
vn -0.83906 -0.30539 0.45023
vn -0.44646 -0.77328 0.45023
vn -0.44646 -0.77328 0.45023
vn -0.44646 -0.77328 0.45023
vn -0.44646 -0.77328 0.45023
vn 0.15505 -0.87935 0.45023
vn 0.15505 -0.87935 0.45023
vn 0.15505 -0.87935 0.45023
vn 0.15505 -0.87935 0.45023
vn 0.68401 -0.57395 0.45023
vn 0.68401 -0.57395 0.45023
vn 0.68401 -0.57395 0.45023
vn 0.68401 -0.57395 0.45023
vn 0.89291 0 0.45023
vn 0.89291 0 0.45023
vn 0.89291 0 0.45023
vn 0.89291 0 0.45023
vn 0.68401 0.57395 0.45023
vn 0.68401 0.57395 0.45023
vn 0.68401 0.57395 0.45023
vn 0.68401 0.57395 0.45023
vn 0.15505 0.87935 0.45023
vn 0.15505 0.87935 0.45023
vn 0.15505 0.87935 0.45023
vn 0.15505 0.87935 0.45023
vn -0.44646 0.77328 0.45023
vn -0.44646 0.77328 0.45023
vn -0.44646 0.77328 0.45023
vn -0.44646 0.77328 0.45023
vn -0.84163 0 0.54006
vn -0.84163 0 0.54006
vn -0.84163 0 0.54006
vn -0.84163 0 0.54006
vn -0.64472 -0.54099 0.54006
vn -0.64472 -0.54099 0.54006
vn -0.64472 -0.54099 0.54006
vn -0.64472 -0.54099 0.54006
vn -0.14615 -0.82884 0.54006
vn -0.14615 -0.82884 0.54006
vn -0.14615 -0.82884 0.54006
vn -0.14615 -0.82884 0.54006
vn 0.42081 -0.72887 0.54006
vn 0.42081 -0.72887 0.54006
vn 0.42081 -0.72887 0.54006
vn 0.42081 -0.72887 0.54006
vn 0.79087 -0.28785 0.54006
vn 0.79087 -0.28785 0.54006
vn 0.79087 -0.28785 0.54006
vn 0.79087 -0.28785 0.54006
vn 0.79087 0.28785 0.54006
vn 0.79087 0.28785 0.54006
vn 0.79087 0.28785 0.54006
vn 0.79087 0.28785 0.54006
vn 0.42081 0.72887 0.54006
vn 0.42081 0.72887 0.54006
vn 0.42081 0.72887 0.54006
vn 0.42081 0.72887 0.54006
vn -0.14615 0.82884 0.54006
vn -0.14615 0.82884 0.54006
vn -0.14615 0.82884 0.54006
vn -0.14615 0.82884 0.54006
vn -0.64472 0.54099 0.54006
vn -0.64472 0.54099 0.54006
vn -0.64472 0.54099 0.54006
vn -0.64472 0.54099 0.54006
f 1 3 2
f 4 2 3
f 5 7 6
f 8 6 7
f 9 11 10
f 12 10 11
f 13 15 14
f 16 14 15
f 17 19 18
f 20 18 19
f 21 23 22
f 24 22 23
f 25 27 26
f 28 26 27
f 29 31 30
f 32 30 31
f 33 35 34
f 36 34 35
f 37 39 38
f 40 38 39
f 41 43 42
f 44 42 43
f 45 47 46
f 48 46 47
f 49 51 50
f 52 50 51
f 53 55 54
f 56 54 55
f 57 59 58
f 60 58 59
f 61 63 62
f 64 62 63
f 65 67 66
f 68 66 67
f 69 71 70
f 72 70 71
f 73 75 74
f 76 74 75
f 77 79 78
f 80 78 79
f 81 83 82
f 84 82 83
f 85 87 86
f 88 86 87
f 89 91 90
f 92 90 91
f 93 95 94
f 96 94 95
f 97 99 98
f 100 98 99
f 101 103 102
f 104 102 103
f 105 107 106
f 108 106 107
f 109 111 110
f 112 110 111
f 113 115 114
f 116 114 115
f 117 119 118
f 120 118 119
f 121 123 122
f 124 122 123
f 125 127 126
f 128 126 127
f 129 131 130
f 132 130 131
f 133 135 134
f 136 134 135
f 137 139 138
f 140 138 139
f 141 143 142
f 144 142 143
f 145 147 146
f 148 146 147
f 149 151 150
f 152 150 151
f 153 155 154
f 156 154 155
f 157 159 158
f 160 158 159
f 161 163 162
f 164 162 163
f 165 167 166
f 168 166 167
f 169 171 170
f 172 170 171
f 173 175 174
f 176 174 175
f 177 179 178
f 180 178 179
f 181 183 182
f 184 182 183
f 185 187 186
f 188 186 187
f 189 191 190
f 192 190 191
f 193 195 194
f 196 194 195
f 197 199 198
f 200 198 199
f 201 203 202
f 204 202 203
f 205 207 206
f 208 206 207
f 209 211 210
f 212 210 211
f 213 215 214
f 216 214 215
f 217 219 218
f 220 218 219
f 221 223 222
f 224 222 223
f 225 227 226
f 228 226 227
f 229 231 230
f 232 230 231
f 233 235 234
f 236 234 235
f 237 239 238
f 240 238 239
f 241 243 242
f 244 242 243
f 245 247 246
f 248 246 247
f 249 251 250
f 252 250 251
f 253 255 254
f 256 254 255
f 257 259 258
f 260 258 259
f 261 263 262
f 264 262 263
f 265 267 266
f 268 266 267
f 269 271 270
f 272 270 271
f 273 275 274
f 276 274 275
f 277 279 278
f 280 278 279
f 281 283 282
f 284 282 283
f 285 287 286
f 288 286 287
f 289 291 290
f 292 290 291
f 293 295 294
f 296 294 295
f 297 299 298
f 300 298 299
f 301 303 302
f 304 302 303
f 305 307 306
f 308 306 307
f 309 311 310
f 312 310 311
f 313 315 314
f 316 314 315
f 317 319 318
f 320 318 319
f 321 323 322
f 324 322 323`
assets["objs/rectangle.obj"]=`v 0.17345 0.58233 0.22183
v 0.23751 0.51827 0.22183
v 0.23751 -0.51827 0.22183
v 0.17345 -0.58233 0.22183
v -0.17345 -0.58233 0.22183
v -0.23751 -0.51827 0.22183
v -0.23751 0.51827 0.22183
v -0.17345 0.58233 0.22183
v 0.17345 0.58233 0.22183
v 0.23751 0.51827 0.22183
v 0.24515 0.71907 0.18558
v 0.24515 0.71907 0.18558
v 0.23751 0.51827 0.22183
v 0.37425 0.58997 0.18558
v 0.23751 0.51827 0.22183
v 0.23751 -0.51827 0.22183
v 0.37425 0.58997 0.18558
v 0.37425 0.58997 0.18558
v 0.23751 -0.51827 0.22183
v 0.37425 -0.58997 0.18558
v 0.23751 -0.51827 0.22183
v 0.17345 -0.58233 0.22183
v 0.37425 -0.58997 0.18558
v 0.37425 -0.58997 0.18558
v 0.17345 -0.58233 0.22183
v 0.24515 -0.71907 0.18558
v 0.17345 -0.58233 0.22183
v -0.17345 -0.58233 0.22183
v 0.24515 -0.71907 0.18558
v 0.24515 -0.71907 0.18558
v -0.17345 -0.58233 0.22183
v -0.24515 -0.71907 0.18558
v -0.17345 -0.58233 0.22183
v -0.23751 -0.51827 0.22183
v -0.24515 -0.71907 0.18558
v -0.24515 -0.71907 0.18558
v -0.23751 -0.51827 0.22183
v -0.37425 -0.58997 0.18558
v -0.23751 -0.51827 0.22183
v -0.23751 0.51827 0.22183
v -0.37425 -0.58997 0.18558
v -0.37425 -0.58997 0.18558
v -0.23751 0.51827 0.22183
v -0.37425 0.58997 0.18558
v -0.23751 0.51827 0.22183
v -0.17345 0.58233 0.22183
v -0.37425 0.58997 0.18558
v -0.37425 0.58997 0.18558
v -0.17345 0.58233 0.22183
v -0.24515 0.71907 0.18558
v -0.17345 0.58233 0.22183
v 0.17345 0.58233 0.22183
v -0.24515 0.71907 0.18558
v -0.24515 0.71907 0.18558
v 0.17345 0.58233 0.22183
v 0.24515 0.71907 0.18558
v 0.24515 0.71907 0.18558
v 0.37425 0.58997 0.18558
v 0.32102 0.86376 0.13025
v 0.32102 0.86376 0.13025
v 0.37425 0.58997 0.18558
v 0.51894 0.66584 0.13025
v 0.37425 0.58997 0.18558
v 0.37425 -0.58997 0.18558
v 0.51894 0.66584 0.13025
v 0.51894 0.66584 0.13025
v 0.37425 -0.58997 0.18558
v 0.51894 -0.66584 0.13025
v 0.37425 -0.58997 0.18558
v 0.24515 -0.71907 0.18558
v 0.51894 -0.66584 0.13025
v 0.51894 -0.66584 0.13025
v 0.24515 -0.71907 0.18558
v 0.32102 -0.86376 0.13025
v 0.24515 -0.71907 0.18558
v -0.24515 -0.71907 0.18558
v 0.32102 -0.86376 0.13025
v 0.32102 -0.86376 0.13025
v -0.24515 -0.71907 0.18558
v -0.32102 -0.86376 0.13025
v -0.24515 -0.71907 0.18558
v -0.37425 -0.58997 0.18558
v -0.32102 -0.86376 0.13025
v -0.32102 -0.86376 0.13025
v -0.37425 -0.58997 0.18558
v -0.51894 -0.66584 0.13025
v -0.37425 -0.58997 0.18558
v -0.37425 0.58997 0.18558
v -0.51894 -0.66584 0.13025
v -0.51894 -0.66584 0.13025
v -0.37425 0.58997 0.18558
v -0.51894 0.66584 0.13025
v -0.37425 0.58997 0.18558
v -0.24515 0.71907 0.18558
v -0.51894 0.66584 0.13025
v -0.51894 0.66584 0.13025
v -0.24515 0.71907 0.18558
v -0.32102 0.86376 0.13025
v -0.24515 0.71907 0.18558
v 0.24515 0.71907 0.18558
v -0.32102 0.86376 0.13025
v -0.32102 0.86376 0.13025
v 0.24515 0.71907 0.18558
v 0.32102 0.86376 0.13025
v 0.32102 0.86376 0.13025
v 0.51894 0.66584 0.13025
v 0.39246 1 0.06223
v 0.39246 1 0.06223
v 0.51894 0.66584 0.13025
v 0.65518 0.73728 0.06223
v 0.51894 0.66584 0.13025
v 0.51894 -0.66584 0.13025
v 0.65518 0.73728 0.06223
v 0.65518 0.73728 0.06223
v 0.51894 -0.66584 0.13025
v 0.65518 -0.73728 0.06223
v 0.51894 -0.66584 0.13025
v 0.32102 -0.86376 0.13025
v 0.65518 -0.73728 0.06223
v 0.65518 -0.73728 0.06223
v 0.32102 -0.86376 0.13025
v 0.39246 -1 0.06223
v 0.32102 -0.86376 0.13025
v -0.32102 -0.86376 0.13025
v 0.39246 -1 0.06223
v 0.39246 -1 0.06223
v -0.32102 -0.86376 0.13025
v -0.39246 -1 0.06223
v -0.32102 -0.86376 0.13025
v -0.51894 -0.66584 0.13025
v -0.39246 -1 0.06223
v -0.39246 -1 0.06223
v -0.51894 -0.66584 0.13025
v -0.65518 -0.73728 0.06223
v -0.51894 -0.66584 0.13025
v -0.51894 0.66584 0.13025
v -0.65518 -0.73728 0.06223
v -0.65518 -0.73728 0.06223
v -0.51894 0.66584 0.13025
v -0.65518 0.73728 0.06223
v -0.51894 0.66584 0.13025
v -0.32102 0.86376 0.13025
v -0.65518 0.73728 0.06223
v -0.65518 0.73728 0.06223
v -0.32102 0.86376 0.13025
v -0.39246 1 0.06223
v -0.32102 0.86376 0.13025
v 0.32102 0.86376 0.13025
v -0.39246 1 0.06223
v -0.39246 1 0.06223
v 0.32102 0.86376 0.13025
v 0.39246 1 0.06223
v 0.39246 1 0.06223
v 0.65518 0.73728 0.06223
v 0.39246 1 0.02275
v 0.65518 0.73728 0.02275
v 0.65518 0.73728 0.06223
v 0.65518 -0.73728 0.06223
v 0.65518 0.73728 0.02275
v 0.65518 -0.73728 0.02275
v 0.65518 -0.73728 0.06223
v 0.39246 -1 0.06223
v 0.65518 -0.73728 0.02275
v 0.39246 -1 0.02275
v 0.39246 -1 0.06223
v -0.39246 -1 0.06223
v 0.39246 -1 0.02275
v -0.39246 -1 0.02275
v -0.39246 -1 0.06223
v -0.65518 -0.73728 0.06223
v -0.39246 -1 0.02275
v -0.65518 -0.73728 0.02275
v -0.65518 -0.73728 0.06223
v -0.65518 0.73728 0.06223
v -0.65518 -0.73728 0.02275
v -0.65518 0.73728 0.02275
v -0.65518 0.73728 0.06223
v -0.39246 1 0.06223
v -0.65518 0.73728 0.02275
v -0.39246 1 0.02275
v -0.39246 1 0.06223
v 0.39246 1 0.06223
v -0.39246 1 0.02275
v 0.39246 1 0.02275
v 0.39246 1 0.02275
v 0.65518 0.73728 0.02275
v 0.2551 0.77069 -0.08207
v 0.42586 0.59992 -0.08207
v 0.65518 0.73728 0.02275
v 0.65518 -0.73728 0.02275
v 0.42586 0.59992 -0.08207
v 0.42586 -0.59992 -0.08207
v 0.65518 -0.73728 0.02275
v 0.39246 -1 0.02275
v 0.42586 -0.59992 -0.08207
v 0.2551 -0.77069 -0.08207
v 0.39246 -1 0.02275
v -0.39246 -1 0.02275
v 0.2551 -0.77069 -0.08207
v -0.2551 -0.77069 -0.08207
v -0.39246 -1 0.02275
v -0.65518 -0.73728 0.02275
v -0.2551 -0.77069 -0.08207
v -0.42586 -0.59992 -0.08207
v -0.65518 -0.73728 0.02275
v -0.65518 0.73728 0.02275
v -0.42586 -0.59992 -0.08207
v -0.42586 0.59992 -0.08207
v -0.65518 0.73728 0.02275
v -0.39246 1 0.02275
v -0.42586 0.59992 -0.08207
v -0.2551 0.77069 -0.08207
v -0.39246 1 0.02275
v 0.39246 1 0.02275
v -0.2551 0.77069 -0.08207
v 0.2551 0.77069 -0.08207
v 0.2551 0.77069 -0.08207
v 0.42586 0.59992 -0.08207
v 0.11774 0.54138 -0.1636
v 0.19655 0.46256 -0.1636
v 0.42586 0.59992 -0.08207
v 0.42586 -0.59992 -0.08207
v 0.19655 0.46256 -0.1636
v 0.19655 -0.46256 -0.1636
v 0.42586 -0.59992 -0.08207
v 0.2551 -0.77069 -0.08207
v 0.19655 -0.46256 -0.1636
v 0.11774 -0.54138 -0.1636
v 0.2551 -0.77069 -0.08207
v -0.2551 -0.77069 -0.08207
v 0.11774 -0.54138 -0.1636
v -0.11774 -0.54138 -0.1636
v -0.2551 -0.77069 -0.08207
v -0.42586 -0.59992 -0.08207
v -0.11774 -0.54138 -0.1636
v -0.19655 -0.46256 -0.1636
v -0.42586 -0.59992 -0.08207
v -0.42586 0.59992 -0.08207
v -0.19655 -0.46256 -0.1636
v -0.19655 0.46256 -0.1636
v -0.42586 0.59992 -0.08207
v -0.2551 0.77069 -0.08207
v -0.19655 0.46256 -0.1636
v -0.11774 0.54138 -0.1636
v -0.2551 0.77069 -0.08207
v 0.2551 0.77069 -0.08207
v -0.11774 0.54138 -0.1636
v 0.11774 0.54138 -0.1636
v 0.11774 0.54138 -0.1636
v 0.19655 0.46256 -0.1636
v 0 0.34482 -0.22183
v 0.19655 0.46256 -0.1636
v 0.19655 -0.46256 -0.1636
v 0 0.34482 -0.22183
v 0.19655 -0.46256 -0.1636
v 0 -0.34482 -0.22183
v 0 0.34482 -0.22183
v 0.19655 -0.46256 -0.1636
v 0.11774 -0.54138 -0.1636
v 0 -0.34482 -0.22183
v 0.11774 -0.54138 -0.1636
v -0.11774 -0.54138 -0.1636
v 0 -0.34482 -0.22183
v -0.11774 -0.54138 -0.1636
v -0.19655 -0.46256 -0.1636
v 0 -0.34482 -0.22183
v -0.19655 -0.46256 -0.1636
v -0.19655 0.46256 -0.1636
v 0 -0.34482 -0.22183
v -0.19655 0.46256 -0.1636
v 0 0.34482 -0.22183
v 0 -0.34482 -0.22183
v -0.19655 0.46256 -0.1636
v -0.11774 0.54138 -0.1636
v 0 0.34482 -0.22183
v -0.11774 0.54138 -0.1636
v 0.11774 0.54138 -0.1636
v 0 0.34482 -0.22183
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0.16888 0.16888 0.97106
vn 0.16888 0.16888 0.97106
vn 0.16888 0.16888 0.97106
vn 0.16888 0.16888 0.97106
vn 0.16888 0.16888 0.97106
vn 0.16888 0.16888 0.97106
vn 0.25625 0 0.96661
vn 0.25625 0 0.96661
vn 0.25625 0 0.96661
vn 0.25625 0 0.96661
vn 0.25625 0 0.96661
vn 0.25625 0 0.96661
vn 0.16888 -0.16888 0.97106
vn 0.16888 -0.16888 0.97106
vn 0.16888 -0.16888 0.97106
vn 0.16888 -0.16888 0.97106
vn 0.16888 -0.16888 0.97106
vn 0.16888 -0.16888 0.97106
vn 0 -0.25625 0.96661
vn 0 -0.25625 0.96661
vn 0 -0.25625 0.96661
vn 0 -0.25625 0.96661
vn 0 -0.25625 0.96661
vn 0 -0.25625 0.96661
vn -0.16888 -0.16888 0.97106
vn -0.16888 -0.16888 0.97106
vn -0.16888 -0.16888 0.97106
vn -0.16888 -0.16888 0.97106
vn -0.16888 -0.16888 0.97106
vn -0.16888 -0.16888 0.97106
vn -0.25625 0 0.96661
vn -0.25625 0 0.96661
vn -0.25625 0 0.96661
vn -0.25625 0 0.96661
vn -0.25625 0 0.96661
vn -0.25625 0 0.96661
vn -0.16888 0.16888 0.97106
vn -0.16888 0.16888 0.97106
vn -0.16888 0.16888 0.97106
vn -0.16888 0.16888 0.97106
vn -0.16888 0.16888 0.97106
vn -0.16888 0.16888 0.97106
vn 0 0.25625 0.96661
vn 0 0.25625 0.96661
vn 0 0.25625 0.96661
vn 0 0.25625 0.96661
vn 0 0.25625 0.96661
vn 0 0.25625 0.96661
vn 0.23644 0.23644 0.94244
vn 0.23644 0.23644 0.94244
vn 0.23644 0.23644 0.94244
vn 0.23644 0.23644 0.94244
vn 0.23644 0.23644 0.94244
vn 0.23644 0.23644 0.94244
vn 0.35721 0 0.93403
vn 0.35721 0 0.93403
vn 0.35721 0 0.93403
vn 0.35721 0 0.93403
vn 0.35721 0 0.93403
vn 0.35721 0 0.93403
vn 0.23644 -0.23644 0.94244
vn 0.23644 -0.23644 0.94244
vn 0.23644 -0.23644 0.94244
vn 0.23644 -0.23644 0.94244
vn 0.23644 -0.23644 0.94244
vn 0.23644 -0.23644 0.94244
vn 0 -0.35721 0.93403
vn 0 -0.35721 0.93403
vn 0 -0.35721 0.93403
vn 0 -0.35721 0.93403
vn 0 -0.35721 0.93403
vn 0 -0.35721 0.93403
vn -0.23644 -0.23644 0.94244
vn -0.23644 -0.23644 0.94244
vn -0.23644 -0.23644 0.94244
vn -0.23644 -0.23644 0.94244
vn -0.23644 -0.23644 0.94244
vn -0.23644 -0.23644 0.94244
vn -0.35721 0 0.93403
vn -0.35721 0 0.93403
vn -0.35721 0 0.93403
vn -0.35721 0 0.93403
vn -0.35721 0 0.93403
vn -0.35721 0 0.93403
vn -0.23644 0.23644 0.94244
vn -0.23644 0.23644 0.94244
vn -0.23644 0.23644 0.94244
vn -0.23644 0.23644 0.94244
vn -0.23644 0.23644 0.94244
vn -0.23644 0.23644 0.94244
vn 0 0.35721 0.93403
vn 0 0.35721 0.93403
vn 0 0.35721 0.93403
vn 0 0.35721 0.93403
vn 0 0.35721 0.93403
vn 0 0.35721 0.93403
vn 0.2972 0.2972 0.90738
vn 0.2972 0.2972 0.90738
vn 0.2972 0.2972 0.90738
vn 0.2972 0.2972 0.90738
vn 0.2972 0.2972 0.90738
vn 0.2972 0.2972 0.90738
vn 0.4467 0 0.89468
vn 0.4467 0 0.89468
vn 0.4467 0 0.89468
vn 0.4467 0 0.89468
vn 0.4467 0 0.89468
vn 0.4467 0 0.89468
vn 0.2972 -0.2972 0.90738
vn 0.2972 -0.2972 0.90738
vn 0.2972 -0.2972 0.90738
vn 0.2972 -0.2972 0.90738
vn 0.2972 -0.2972 0.90738
vn 0.2972 -0.2972 0.90738
vn 0 -0.4467 0.89468
vn 0 -0.4467 0.89468
vn 0 -0.4467 0.89468
vn 0 -0.4467 0.89468
vn 0 -0.4467 0.89468
vn 0 -0.4467 0.89468
vn -0.2972 -0.2972 0.90738
vn -0.2972 -0.2972 0.90738
vn -0.2972 -0.2972 0.90738
vn -0.2972 -0.2972 0.90738
vn -0.2972 -0.2972 0.90738
vn -0.2972 -0.2972 0.90738
vn -0.4467 0 0.89468
vn -0.4467 0 0.89468
vn -0.4467 0 0.89468
vn -0.4467 0 0.89468
vn -0.4467 0 0.89468
vn -0.4467 0 0.89468
vn -0.2972 0.2972 0.90738
vn -0.2972 0.2972 0.90738
vn -0.2972 0.2972 0.90738
vn -0.2972 0.2972 0.90738
vn -0.2972 0.2972 0.90738
vn -0.2972 0.2972 0.90738
vn 0 0.4467 0.89468
vn 0 0.4467 0.89468
vn 0 0.4467 0.89468
vn 0 0.4467 0.89468
vn 0 0.4467 0.89468
vn 0 0.4467 0.89468
vn 0.70711 0.70711 0
vn 0.70711 0.70711 0
vn 0.70711 0.70711 0
vn 0.70711 0.70711 0
vn 1 0 0
vn 1 0 0
vn 1 0 0
vn 1 0 0
vn 0.70711 -0.70711 0
vn 0.70711 -0.70711 0
vn 0.70711 -0.70711 0
vn 0.70711 -0.70711 0
vn 0 -1 0
vn 0 -1 0
vn 0 -1 0
vn 0 -1 0
vn -0.70711 -0.70711 0
vn -0.70711 -0.70711 0
vn -0.70711 -0.70711 0
vn -0.70711 -0.70711 0
vn -1 0 0
vn -1 0 0
vn -1 0 0
vn -1 0 0
vn -0.70711 0.70711 0
vn -0.70711 0.70711 0
vn -0.70711 0.70711 0
vn -0.70711 0.70711 0
vn 0 1 0
vn 0 1 0
vn 0 1 0
vn 0 1 0
vn 0.26503 0.26503 -0.9271
vn 0.26503 0.26503 -0.9271
vn 0.26503 0.26503 -0.9271
vn 0.26503 0.26503 -0.9271
vn 0.41573 0 -0.90949
vn 0.41573 0 -0.90949
vn 0.41573 0 -0.90949
vn 0.41573 0 -0.90949
vn 0.26503 -0.26503 -0.9271
vn 0.26503 -0.26503 -0.9271
vn 0.26503 -0.26503 -0.9271
vn 0.26503 -0.26503 -0.9271
vn 0 -0.41573 -0.90949
vn 0 -0.41573 -0.90949
vn 0 -0.41573 -0.90949
vn 0 -0.41573 -0.90949
vn -0.26503 -0.26503 -0.9271
vn -0.26503 -0.26503 -0.9271
vn -0.26503 -0.26503 -0.9271
vn -0.26503 -0.26503 -0.9271
vn -0.41573 0 -0.90949
vn -0.41573 0 -0.90949
vn -0.41573 0 -0.90949
vn -0.41573 0 -0.90949
vn -0.26503 0.26503 -0.9271
vn -0.26503 0.26503 -0.9271
vn -0.26503 0.26503 -0.9271
vn -0.26503 0.26503 -0.9271
vn 0 0.41573 -0.90949
vn 0 0.41573 -0.90949
vn 0 0.41573 -0.90949
vn 0 0.41573 -0.90949
vn 0.2121 0.2121 -0.95395
vn 0.2121 0.2121 -0.95395
vn 0.2121 0.2121 -0.95395
vn 0.2121 0.2121 -0.95395
vn 0.33498 0 -0.94222
vn 0.33498 0 -0.94222
vn 0.33498 0 -0.94222
vn 0.33498 0 -0.94222
vn 0.2121 -0.2121 -0.95395
vn 0.2121 -0.2121 -0.95395
vn 0.2121 -0.2121 -0.95395
vn 0.2121 -0.2121 -0.95395
vn 0 -0.33498 -0.94222
vn 0 -0.33498 -0.94222
vn 0 -0.33498 -0.94222
vn 0 -0.33498 -0.94222
vn -0.2121 -0.2121 -0.95395
vn -0.2121 -0.2121 -0.95395
vn -0.2121 -0.2121 -0.95395
vn -0.2121 -0.2121 -0.95395
vn -0.33498 0 -0.94222
vn -0.33498 0 -0.94222
vn -0.33498 0 -0.94222
vn -0.33498 0 -0.94222
vn -0.2121 0.2121 -0.95395
vn -0.2121 0.2121 -0.95395
vn -0.2121 0.2121 -0.95395
vn -0.2121 0.2121 -0.95395
vn 0 0.33498 -0.94222
vn 0 0.33498 -0.94222
vn 0 0.33498 -0.94222
vn 0 0.33498 -0.94222
vn 0.17923 0.17923 -0.96734
vn 0.17923 0.17923 -0.96734
vn 0.17923 0.17923 -0.96734
vn 0.28407 0 -0.9588
vn 0.28407 0 -0.9588
vn 0.28407 0 -0.9588
vn 0.28407 0 -0.9588
vn 0.28407 0 -0.9588
vn 0.28407 0 -0.9588
vn 0.17923 -0.17923 -0.96734
vn 0.17923 -0.17923 -0.96734
vn 0.17923 -0.17923 -0.96734
vn 0 -0.28407 -0.9588
vn 0 -0.28407 -0.9588
vn 0 -0.28407 -0.9588
vn -0.17923 -0.17923 -0.96734
vn -0.17923 -0.17923 -0.96734
vn -0.17923 -0.17923 -0.96734
vn -0.28407 0 -0.9588
vn -0.28407 0 -0.9588
vn -0.28407 0 -0.9588
vn -0.28407 0 -0.9588
vn -0.28407 0 -0.9588
vn -0.28407 0 -0.9588
vn -0.17923 0.17923 -0.96734
vn -0.17923 0.17923 -0.96734
vn -0.17923 0.17923 -0.96734
vn 0 0.28407 -0.9588
vn 0 0.28407 -0.9588
vn 0 0.28407 -0.9588
f 1 3 2
f 1 4 3
f 1 5 4
f 1 6 5
f 1 7 6
f 1 8 7
f 9 10 11
f 12 13 14
f 15 16 17
f 18 19 20
f 21 22 23
f 24 25 26
f 27 28 29
f 30 31 32
f 33 34 35
f 36 37 38
f 39 40 41
f 42 43 44
f 45 46 47
f 48 49 50
f 51 52 53
f 54 55 56
f 57 58 59
f 60 61 62
f 63 64 65
f 66 67 68
f 69 70 71
f 72 73 74
f 75 76 77
f 78 79 80
f 81 82 83
f 84 85 86
f 87 88 89
f 90 91 92
f 93 94 95
f 96 97 98
f 99 100 101
f 102 103 104
f 105 106 107
f 108 109 110
f 111 112 113
f 114 115 116
f 117 118 119
f 120 121 122
f 123 124 125
f 126 127 128
f 129 130 131
f 132 133 134
f 135 136 137
f 138 139 140
f 141 142 143
f 144 145 146
f 147 148 149
f 150 151 152
f 153 154 155
f 155 154 156
f 157 158 159
f 159 158 160
f 161 162 163
f 163 162 164
f 165 166 167
f 167 166 168
f 169 170 171
f 171 170 172
f 173 174 175
f 175 174 176
f 177 178 179
f 179 178 180
f 181 182 183
f 183 182 184
f 185 186 187
f 187 186 188
f 189 190 191
f 191 190 192
f 193 194 195
f 195 194 196
f 197 198 199
f 199 198 200
f 201 202 203
f 203 202 204
f 205 206 207
f 207 206 208
f 209 210 211
f 211 210 212
f 213 214 215
f 215 214 216
f 217 218 219
f 219 218 220
f 221 222 223
f 223 222 224
f 225 226 227
f 227 226 228
f 229 230 231
f 231 230 232
f 233 234 235
f 235 234 236
f 237 238 239
f 239 238 240
f 241 242 243
f 243 242 244
f 245 246 247
f 247 246 248
f 249 250 251
f 252 253 254
f 255 256 257
f 258 259 260
f 261 262 263
f 264 265 266
f 267 268 269
f 270 271 272
f 273 274 275
f 276 277 278`
assets["objs/map_square.obj"]=`v -1 -1 0
v -1 1 0
v 1 1 0
v 1 -1 0
vt 0 1
vt 0 0
vt 1 0
vt 1 1
vn 0 0 1
f 1/1/1 3/3/1 2/2/1
f 3/3/1 1/1/1 4/4/1`
assets["objs/trilliant.obj"]=`v 0 0 0.37667
v 0.60548 0 0.37667
v 0.16993 0.29433 0.37667
v -0.30274 0.52436 0.37667
v -0.33987 0 0.37667
v -0.30274 -0.52436 0.37667
v 0.16993 -0.29433 0.37667
v 0.68726 0.0766 0.31446
v 0.16993 0.29433 0.37667
v 0.60548 0 0.37667
v -0.27729 0.63349 0.31446
v -0.30274 0.52436 0.37667
v 0.16993 0.29433 0.37667
v -0.40997 0.55688 0.31446
v -0.33987 0 0.37667
v -0.30274 0.52436 0.37667
v -0.40997 -0.55688 0.31446
v -0.30274 -0.52436 0.37667
v -0.33987 0 0.37667
v -0.27729 -0.63349 0.31446
v 0.16993 -0.29433 0.37667
v -0.30274 -0.52436 0.37667
v 0.68726 -0.0766 0.31446
v 0.60548 0 0.37667
v 0.16993 -0.29433 0.37667
v 0.60548 0 0.37667
v 0.68726 -0.0766 0.31446
v 0.68726 0.0766 0.31446
v 0.96301 0 0.10472
v -0.30274 0.52436 0.37667
v -0.27729 0.63349 0.31446
v -0.40997 0.55688 0.31446
v -0.4815 0.83399 0.10472
v -0.30274 -0.52436 0.37667
v -0.40997 -0.55688 0.31446
v -0.27729 -0.63349 0.31446
v -0.4815 -0.83399 0.10472
v 0.68726 0.0766 0.31446
v -0.27729 0.63349 0.31446
v 0.16993 0.29433 0.37667
v 0.32317 0.55975 0.10472
v -0.40997 0.55688 0.31446
v -0.40997 -0.55688 0.31446
v -0.33987 0 0.37667
v -0.64634 0 0.10472
v -0.27729 -0.63349 0.31446
v 0.68726 -0.0766 0.31446
v 0.16993 -0.29433 0.37667
v 0.32317 -0.55975 0.10472
v 0.68726 0.0766 0.31446
v 0.96301 0 0.10472
v 0.69647 0.29206 0.10472
v 0.68726 0.0766 0.31446
v 0.69647 0.29206 0.10472
v 0.32317 0.55975 0.10472
v -0.27729 0.63349 0.31446
v 0.32317 0.55975 0.10472
v -0.0953 0.74919 0.10472
v -0.27729 0.63349 0.31446
v -0.0953 0.74919 0.10472
v -0.4815 0.83399 0.10472
v -0.40997 0.55688 0.31446
v -0.4815 0.83399 0.10472
v -0.60117 0.45713 0.10472
v -0.40997 0.55688 0.31446
v -0.60117 0.45713 0.10472
v -0.64634 0 0.10472
v -0.40997 -0.55688 0.31446
v -0.64634 0 0.10472
v -0.60117 -0.45713 0.10472
v -0.40997 -0.55688 0.31446
v -0.60117 -0.45713 0.10472
v -0.4815 -0.83399 0.10472
v -0.27729 -0.63349 0.31446
v -0.4815 -0.83399 0.10472
v -0.0953 -0.74919 0.10472
v -0.27729 -0.63349 0.31446
v -0.0953 -0.74919 0.10472
v 0.32317 -0.55975 0.10472
v 0.68726 -0.0766 0.31446
v 0.32317 -0.55975 0.10472
v 0.69647 -0.29206 0.10472
v 0.68726 -0.0766 0.31446
v 0.69647 -0.29206 0.10472
v 0.96301 0 0.10472
v 0.69647 0.29206 0.10472
v 0.96301 0 0.10472
v 0.12224 0.21173 -0.27528
v 0.32317 0.55975 0.10472
v 0.69647 0.29206 0.10472
v 0.12224 0.21173 -0.27528
v -0.0953 0.74919 0.10472
v 0.32317 0.55975 0.10472
v 0.12224 0.21173 -0.27528
v -0.4815 0.83399 0.10472
v -0.0953 0.74919 0.10472
v 0.12224 0.21173 -0.27528
v -0.60117 0.45713 0.10472
v -0.4815 0.83399 0.10472
v -0.24449 0 -0.27528
v -0.64634 0 0.10472
v -0.60117 0.45713 0.10472
v -0.24449 0 -0.27528
v -0.60117 -0.45713 0.10472
v -0.64634 0 0.10472
v -0.24449 0 -0.27528
v -0.4815 -0.83399 0.10472
v -0.60117 -0.45713 0.10472
v -0.24449 0 -0.27528
v -0.0953 -0.74919 0.10472
v -0.4815 -0.83399 0.10472
v 0.12224 -0.21173 -0.27528
v 0.32317 -0.55975 0.10472
v -0.0953 -0.74919 0.10472
v 0.12224 -0.21173 -0.27528
v 0.69647 -0.29206 0.10472
v 0.32317 -0.55975 0.10472
v 0.12224 -0.21173 -0.27528
v 0.96301 0 0.10472
v 0.69647 -0.29206 0.10472
v 0.12224 -0.21173 -0.27528
v 0.96301 0 0.10472
v 0 0 -0.37667
v 0.12224 0.21173 -0.27528
v 0.96301 0 0.10472
v 0.12224 -0.21173 -0.27528
v 0 0 -0.37667
v -0.4815 0.83399 0.10472
v 0 0 -0.37667
v -0.24449 0 -0.27528
v -0.4815 0.83399 0.10472
v 0.12224 0.21173 -0.27528
v 0 0 -0.37667
v -0.4815 -0.83399 0.10472
v 0 0 -0.37667
v 0.12224 -0.21173 -0.27528
v -0.4815 -0.83399 0.10472
v -0.24449 0 -0.27528
v 0 0 -0.37667
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0.27702 0.40993 0.86903
vn 0.27702 0.40993 0.86903
vn 0.27702 0.40993 0.86903
vn 0.2165 0.44487 0.86903
vn 0.2165 0.44487 0.86903
vn 0.2165 0.44487 0.86903
vn -0.49352 0.03495 0.86903
vn -0.49352 0.03495 0.86903
vn -0.49352 0.03495 0.86903
vn -0.49352 -0.03495 0.86903
vn -0.49352 -0.03495 0.86903
vn -0.49352 -0.03495 0.86903
vn 0.2165 -0.44487 0.86903
vn 0.2165 -0.44487 0.86903
vn 0.2165 -0.44487 0.86903
vn 0.27702 -0.40993 0.86903
vn 0.27702 -0.40993 0.86903
vn 0.27702 -0.40993 0.86903
vn 0.6054 0 0.79592
vn 0.6054 0 0.79592
vn 0.6054 0 0.79592
vn 0.6054 0 0.79592
vn -0.3027 0.52429 0.79592
vn -0.3027 0.52429 0.79592
vn -0.3027 0.52429 0.79592
vn -0.3027 0.52429 0.79592
vn -0.3027 -0.52429 0.79592
vn -0.3027 -0.52429 0.79592
vn -0.3027 -0.52429 0.79592
vn -0.3027 -0.52429 0.79592
vn 0.33186 0.57479 0.74799
vn 0.33186 0.57479 0.74799
vn 0.33186 0.57479 0.74799
vn 0.33186 0.57479 0.74799
vn -0.66371 0 0.74799
vn -0.66371 0 0.74799
vn -0.66371 0 0.74799
vn -0.66371 0 0.74799
vn 0.33186 -0.57479 0.74799
vn 0.33186 -0.57479 0.74799
vn 0.33186 -0.57479 0.74799
vn 0.33186 -0.57479 0.74799
vn 0.59804 0.54578 0.58691
vn 0.59804 0.54578 0.58691
vn 0.59804 0.54578 0.58691
vn 0.44175 0.61602 0.65221
vn 0.44175 0.61602 0.65221
vn 0.44175 0.61602 0.65221
vn 0.31262 0.69058 0.65221
vn 0.31262 0.69058 0.65221
vn 0.31262 0.69058 0.65221
vn 0.17364 0.79081 0.58691
vn 0.17364 0.79081 0.58691
vn 0.17364 0.79081 0.58691
vn -0.77168 0.24503 0.58691
vn -0.77168 0.24503 0.58691
vn -0.77168 0.24503 0.58691
vn -0.75437 0.07455 0.65221
vn -0.75437 0.07455 0.65221
vn -0.75437 0.07455 0.65221
vn -0.75437 -0.07455 0.65221
vn -0.75437 -0.07455 0.65221
vn -0.75437 -0.07455 0.65221
vn -0.77168 -0.24503 0.58691
vn -0.77168 -0.24503 0.58691
vn -0.77168 -0.24503 0.58691
vn 0.17364 -0.79081 0.58691
vn 0.17364 -0.79081 0.58691
vn 0.17364 -0.79081 0.58691
vn 0.31262 -0.69058 0.65221
vn 0.31262 -0.69058 0.65221
vn 0.31262 -0.69058 0.65221
vn 0.44175 -0.61602 0.65221
vn 0.44175 -0.61602 0.65221
vn 0.44175 -0.61602 0.65221
vn 0.59804 -0.54578 0.58691
vn 0.59804 -0.54578 0.58691
vn 0.59804 -0.54578 0.58691
vn 0.45948 0.41933 -0.78297
vn 0.45948 0.41933 -0.78297
vn 0.45948 0.41933 -0.78297
vn 0.40142 0.55978 -0.72492
vn 0.40142 0.55978 -0.72492
vn 0.40142 0.55978 -0.72492
vn 0.28408 0.62753 -0.72492
vn 0.28408 0.62753 -0.72492
vn 0.28408 0.62753 -0.72492
vn 0.13341 0.60758 -0.78297
vn 0.13341 0.60758 -0.78297
vn 0.13341 0.60758 -0.78297
vn -0.59289 0.18826 -0.78297
vn -0.59289 0.18826 -0.78297
vn -0.59289 0.18826 -0.78297
vn -0.68549 0.06775 -0.72492
vn -0.68549 0.06775 -0.72492
vn -0.68549 0.06775 -0.72492
vn -0.68549 -0.06775 -0.72492
vn -0.68549 -0.06775 -0.72492
vn -0.68549 -0.06775 -0.72492
vn -0.59289 -0.18826 -0.78297
vn -0.59289 -0.18826 -0.78297
vn -0.59289 -0.18826 -0.78297
vn 0.13341 -0.60758 -0.78297
vn 0.13341 -0.60758 -0.78297
vn 0.13341 -0.60758 -0.78297
vn 0.28408 -0.62753 -0.72492
vn 0.28408 -0.62753 -0.72492
vn 0.28408 -0.62753 -0.72492
vn 0.40142 -0.55978 -0.72492
vn 0.40142 -0.55978 -0.72492
vn 0.40142 -0.55978 -0.72492
vn 0.45948 -0.41933 -0.78297
vn 0.45948 -0.41933 -0.78297
vn 0.45948 -0.41933 -0.78297
vn 0.44079 0.16777 -0.88179
vn 0.44079 0.16777 -0.88179
vn 0.44079 0.16777 -0.88179
vn 0.44079 -0.16777 -0.88179
vn 0.44079 -0.16777 -0.88179
vn 0.44079 -0.16777 -0.88179
vn -0.36569 0.29785 -0.88179
vn -0.36569 0.29785 -0.88179
vn -0.36569 0.29785 -0.88179
vn -0.0751 0.46562 -0.88179
vn -0.0751 0.46562 -0.88179
vn -0.0751 0.46562 -0.88179
vn -0.0751 -0.46562 -0.88179
vn -0.0751 -0.46562 -0.88179
vn -0.0751 -0.46562 -0.88179
vn -0.36569 -0.29785 -0.88179
vn -0.36569 -0.29785 -0.88179
vn -0.36569 -0.29785 -0.88179
f 1 2 3
f 1 3 4
f 1 4 5
f 1 5 6
f 1 6 7
f 1 7 2
f 8 9 10
f 11 12 13
f 14 15 16
f 17 18 19
f 20 21 22
f 23 24 25
f 26 27 28
f 28 27 29
f 30 31 32
f 32 31 33
f 34 35 36
f 36 35 37
f 40 38 39
f 39 38 41
f 44 42 43
f 43 42 45
f 48 46 47
f 47 46 49
f 50 51 52
f 53 54 55
f 56 57 58
f 59 60 61
f 62 63 64
f 65 66 67
f 68 69 70
f 71 72 73
f 74 75 76
f 77 78 79
f 80 81 82
f 83 84 85
f 86 87 88
f 89 90 91
f 92 93 94
f 95 96 97
f 98 99 100
f 101 102 103
f 104 105 106
f 107 108 109
f 110 111 112
f 113 114 115
f 116 117 118
f 119 120 121
f 122 123 124
f 125 126 127
f 128 129 130
f 131 132 133
f 134 135 136
f 137 138 139`
assets["objs/map_hexagon.obj"]=`v 0 0 0
v 0 1 0
v -0.89443 0.5 0
v -0.89443 -0.5 0
v 0 -1 0
v 0.89443 -0.5 0
v 0.89443 0.5 0
vt 0.5 0.5
vt 0.5 0
vt 0.05279 0.25
vt 0.05279 0.75
vt 0.5 1
vt 0.94721 .75
vt 0.94721 0.25
vn 0 0 1
f 1/1/1 2/2/1 3/3/1
f 1/1/1 3/3/1 4/4/1
f 1/1/1 4/4/1 5/5/1
f 1/1/1 5/5/1 6/6/1
f 1/1/1 6/6/1 7/7/1
f 1/1/1 7/7/1 2/2/1`
assets["shaders/indicator.vert"]=`precision mediump float;
attribute vec4 a_pos;
attribute vec2 a_tex;
uniform mat4 u_pvmMat;
uniform mat4 u_mMat;
varying vec2 v_tex;


void main() {
    gl_Position = u_pvmMat * a_pos;
    v_tex = a_tex;
}
`
assets["shaders/indicator.frag"]=`precision mediump float;
uniform sampler2D u_sampler;
uniform vec4 u_data[2];
varying vec2 v_tex;

float MIN_LIGHT = 0.3;

float checkExists(float _x) {
    float x = float(_x < 1.0) * _x + float(_x >= 1.0) * (_x - 1.0);
    float underFirst = float(v_tex.y < x * 3.0);
    float underSecond = float(v_tex.y < -x*3.0 + 2.0);
    float w = underSecond * underFirst;
    return w;
}

void main() {
    float a = checkExists(v_tex.x + u_data[0].x);
    float b = checkExists(v_tex.x + u_data[0].y);
    float c = checkExists(v_tex.x + u_data[0].z);
    float d = checkExists(v_tex.x + u_data[0].w);
    float w = min(1.0, a + b + c + d) * (1.0 - v_tex.y);
    gl_FragColor = vec4(u_data[1].xyz, w);
}
`
assets["shaders/scene.frag"]=`precision mediump float;
uniform sampler2D u_sampler0;
uniform sampler2D u_sampler1;
uniform sampler2D u_sampler2;
uniform sampler2D u_sampler3;
uniform sampler2D u_sampler4;
uniform sampler2D u_sampler5;
uniform sampler2D u_sampler6;
uniform sampler2D u_sampler7;
uniform vec4 u_data[3];
varying vec2 v_tex;

float MIN_LIGHT = 0.3;

vec4 layer(vec4 bot, vec4 top) {
    float topFactor = top.w;
    float botFactor = bot.w * (1.0-top.w);
    return vec4(topFactor*top.xyz + botFactor*bot.xyz, topFactor + botFactor);
}

float modX(float _x) {
    float x = _x;
    x = float(x >= 1.0) * (x - 1.0) + float(x < 1.0) * x;
    x = float(x >= 1.0) * (x - 1.0) + float(x < 1.0) * x;
    x = float(x >= 1.0) * (x - 1.0) + float(x < 1.0) * x;
    x = float(x >= 1.0) * (x - 1.0) + float(x < 1.0) * x;
    x = float(x >= 1.0) * (x - 1.0) + float(x < 1.0) * x;
    return x;
}

void main() {
    vec2 texP = vec2(v_tex.x*u_data[0].x, v_tex.y);
    vec4 img0 = texture2D(u_sampler0, vec2(modX(v_tex.x*u_data[0].x+u_data[1].x), v_tex.y));
    vec4 img1 = texture2D(u_sampler1, vec2(modX(v_tex.x*u_data[0].x+u_data[1].y), v_tex.y));
    vec4 img2 = texture2D(u_sampler2, vec2(modX(v_tex.x*u_data[0].x+u_data[1].z), v_tex.y));
    vec4 img3 = texture2D(u_sampler3, vec2(modX(v_tex.x*u_data[0].x+u_data[1].w), v_tex.y));
    vec4 img4 = texture2D(u_sampler4, vec2(modX(v_tex.x*u_data[0].x+u_data[2].x), v_tex.y));
    vec4 img5 = texture2D(u_sampler5, vec2(modX(v_tex.x*u_data[0].x+u_data[2].y), v_tex.y));
    vec4 img6 = texture2D(u_sampler6, vec2(modX(v_tex.x*u_data[0].x+u_data[2].z), v_tex.y));
    vec4 img7 = texture2D(u_sampler7, vec2(modX(v_tex.x*u_data[0].x+u_data[2].w), v_tex.y));

    vec4 img = layer(img0, img1);
    img = layer(img, img2);
    img = layer(img, img3);
    img = layer(img, img4);
    img = layer(img, img5);
    img = layer(img, img6);
    img = layer(img, img7);

    gl_FragColor = img;
}
`
assets["shaders/row_check.frag"]=`precision mediump float;
uniform sampler2D u_sampler;
uniform vec4 u_data[1];
varying vec2 v_tex;

void main() {
    float x = 0.0;
    x += float(v_tex.y < 0.5) * (v_tex.x + v_tex.y * u_data[0].w);
    x += float(v_tex.y >= 0.5) * (v_tex.x - v_tex.y * u_data[0].w + u_data[0].w);
    vec4 img = texture2D(u_sampler, vec2(x, v_tex.y));
    float dx = 1.0 - 2.0 * v_tex.x;
    float dy = 1.0 - 2.0 * v_tex.y;
    float dist = dx*dx + dy*dy;
    gl_FragColor = vec4(img.x*u_data[0].x, img.x*u_data[0].y, img.x*u_data[0].z, sqrt(max(0.0, 1.0-dist)));
}
`
assets["shaders/scene.vert"]=`precision mediump float;
attribute vec4 a_pos;
attribute vec2 a_tex;
uniform mat4 u_pvmMat;
varying vec2 v_tex;


void main() {
    gl_Position = u_pvmMat * a_pos;
    v_tex = a_tex;
}
`
assets["shaders/pos_norm_ind_tex.vert"]=`precision mediump float;
attribute vec4 a_pos;
attribute vec4 a_norm;
attribute vec2 a_tex;
uniform mat4 u_pvmMat;
uniform mat4 u_mMat;
varying vec3 v_norm;
varying vec2 v_tex;


void main() {
    gl_Position = u_pvmMat * a_pos;
    v_norm = normalize((u_mMat * a_norm).xyz);
    v_tex = a_tex;
}
`
assets["shaders/row_check.vert"]=`precision mediump float;
attribute vec4 a_pos;
attribute vec2 a_tex;
uniform mat4 u_pvmMat;
uniform mat4 u_mMat;
varying vec2 v_tex;


void main() {
    gl_Position = u_pvmMat * a_pos;
    v_tex = a_tex;
}
`
assets["shaders/pos_norm_ind_tex.frag"]=`precision mediump float;
uniform sampler2D u_sampler;
uniform vec3 u_light_dir[1];
varying vec3 v_norm;
varying vec2 v_tex;

float MIN_LIGHT = 0.3;

void main() {
    float pct = MIN_LIGHT + (1.0 - MIN_LIGHT)*dot(v_norm, u_light_dir[0]);
    vec4 img = texture2D(u_sampler, v_tex);
    gl_FragColor = vec4(pct * img.xyz, img.w);
}
`
