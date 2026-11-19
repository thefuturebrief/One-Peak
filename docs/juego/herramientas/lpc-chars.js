// Personajes de prueba armados con piezas LPC (solo la animación de caminar).
// Cada capa: [carpeta base, paleta destino o color de archivo]. El resolvedor busca la variante del cuerpo.
module.exports = [
  { id: 'grumete', name: 'Grumete', body: 'male', skin: 'light', layers: [
    ['head/heads/human/male', 'body:light'], ['eyes/human/adult/default', 'eye:brown'], ['eyes/eyebrows/thick/adult', 'hair:chestnut'],
    ['feet/boots/fold', 'cloth:brown'], ['legs/pantaloons', 'cloth:tan'], ['torso/clothes/shortsleeve/tshirt', 'cloth:white'],
    ['torso/clothes/vest_open', 'file:navy'], ['hair/messy1/adult', 'hair:chestnut'], ['hat/headband/tied/adult', 'cloth:orange']] },
  { id: 'capitan', name: 'Capitán pirata', body: 'male', skin: 'bronze', layers: [
    ['head/heads/human/male', 'body:bronze'], ['eyes/human/adult/anger', 'eye:red'], ['eyes/eyebrows/thick/adult', 'hair:black'],
    ['feet/boots/fold', 'cloth:black'], ['legs/pantaloons', 'cloth:black'], ['torso/clothes/longsleeve/formal', 'cloth:white'],
    ['torso/jacket/frock', 'file:maroon'], ['beards/beard/basic', 'hair:black'], ['hair/long/adult', 'hair:black'],
    ['hat/cloth/leather_cap/feather/adult', 'file:black'], ['facial/patches/eyepatch/ambi/adult', 'file:black'], ['body/prosthesis/hook/male', 'metal:iron']] },
  { id: 'marine', name: 'Marine', body: 'male', skin: 'light', layers: [
    ['head/heads/human/male', 'body:light'], ['eyes/human/adult/neutral', 'eye:blue'], ['eyes/eyebrows/thin/adult', 'hair:dark_brown'],
    ['feet/shoes/basic', 'cloth:black'], ['legs/formal', 'cloth:navy'], ['torso/clothes/longsleeve/formal', 'cloth:white'],
    ['hair/buzzcut/adult', 'hair:dark_brown'], ['weapon/sword/arming/universal/fg', 'file:steel']] },
  { id: 'pescadora', name: 'Pescadora', body: 'female', skin: 'olive', layers: [
    ['head/heads/human/female', 'body:olive'], ['eyes/human/adult/default', 'eye:brown'], ['eyes/eyebrows/thin/adult', 'hair:black'],
    ['feet/sandals', 'cloth:brown'], ['legs/pants', 'cloth:brown'], ['torso/clothes/shortsleeve/tshirt', 'cloth:yellow'],
    ['torso/aprons/apron', 'file:white'], ['hair/bob/adult', 'hair:black'], ['hat/cloth/bandana2/adult', 'cloth:red']] },
  { id: 'viejo', name: 'Pescador viejo', body: 'male', skin: 'taupe', layers: [
    ['head/heads/human/male_elderly', 'body:taupe'], ['eyes/human/adult/sad', 'eye:gray'], ['eyes/eyebrows/thick/adult', 'hair:white'],
    ['feet/boots/fold', 'cloth:yellow'], ['legs/pants', 'cloth:brown'], ['torso/clothes/longsleeve/formal', 'cloth:teal'],
    ['hair/balding/adult', 'hair:white'], ['beards/mustache/walrus', 'hair:white']] },
  { id: 'maton', name: 'Matón', body: 'muscular', skin: 'brown', layers: [
    ['head/heads/human/male', 'body:brown'], ['eyes/human/adult/anger', 'eye:brown'], ['eyes/eyebrows/thick/adult', 'hair:black'],
    ['feet/boots/fold', 'cloth:black'], ['legs/pantaloons', 'cloth:maroon'], ['hair/shorthawk/adult', 'hair:black'], ['beards/beard/basic', 'hair:black']] },
  { id: 'navegante', name: 'Navegante', body: 'female', skin: 'light', layers: [
    ['head/heads/human/female', 'body:light'], ['eyes/human/adult/default', 'eye:green'], ['eyes/eyebrows/thin/adult', 'hair:blue'],
    ['feet/boots/fold', 'cloth:brown'], ['legs/pants', 'cloth:navy'], ['torso/clothes/shortsleeve/tshirt', 'cloth:white'],
    ['hair/long_straight/adult', 'hair:blue']] },
  { id: 'madre', name: 'Madre', body: 'female', skin: 'light', layers: [
    ['head/heads/human/female', 'body:light'], ['eyes/human/adult/default', 'eye:green'], ['eyes/eyebrows/thin/adult', 'hair:chestnut'],
    ['feet/sandals', 'cloth:brown'], ['legs/pants', 'cloth:brown'], ['torso/clothes/shortsleeve/tshirt', 'cloth:rose'],
    ['torso/aprons/apron', 'file:white'], ['hair/bangs_bun/adult', 'hair:chestnut']] },
  { id: 'padre', name: 'Padre', body: 'male', skin: 'light', layers: [
    ['head/heads/human/male', 'body:light'], ['eyes/human/adult/default', 'eye:brown'], ['eyes/eyebrows/thick/adult', 'hair:chestnut'],
    ['feet/boots/fold', 'cloth:black'], ['legs/pantaloons', 'cloth:charcoal'], ['torso/clothes/shortsleeve/tshirt', 'cloth:slate'],
    ['torso/clothes/vest_open', 'file:brown'], ['hair/messy2/adult', 'hair:chestnut'], ['beards/beard/basic', 'hair:chestnut']] },
  { id: 'hermano', name: 'Hermano', body: 'teen', skin: 'light', layers: [
    ['head/heads/human/male_small', 'body:light'], ['eyes/human/adult/default', 'eye:brown'], ['eyes/eyebrows/thin/adult', 'hair:chestnut'],
    ['torso/clothes/shortsleeve/tshirt', 'cloth:green'], ['legs/pants', 'cloth:brown'], ['hair/bedhead/adult', 'hair:chestnut']] },
  { id: 'hermana', name: 'Hermana', body: 'female', skin: 'light', layers: [
    ['head/heads/human/female_small', 'body:light'], ['eyes/human/adult/default', 'eye:green'], ['eyes/eyebrows/thin/adult', 'hair:chestnut'],
    ['feet/sandals', 'cloth:brown'], ['legs/pants', 'cloth:navy'], ['torso/clothes/shortsleeve/tshirt', 'cloth:sky'], ['hair/pixie/adult', 'hair:chestnut']] },
  { id: 'nino', name: 'Niño', body: 'child', skin: 'light', layers: [
    ['head/heads/human/child', 'body:light'], ['legs/pants', 'file:blue'],
    ['torso/clothes/shirt', 'file:red'], ['hair/relm_short/child', 'hair:chestnut']] },
  { id: 'tabernera', name: 'Tabernera', body: 'female', skin: 'amber', layers: [
    ['head/heads/human/female', 'body:amber'], ['eyes/human/adult/default', 'eye:brown'], ['eyes/eyebrows/thin/adult', 'hair:redhead'],
    ['feet/shoes/basic', 'cloth:black'], ['legs/pants', 'cloth:maroon'], ['torso/clothes/shortsleeve/tshirt', 'cloth:white'],
    ['torso/aprons/apron', 'file:white'], ['hair/long_straight/adult', 'hair:redhead']] },
  { id: 'vecina', name: 'Vecina', body: 'female', skin: 'taupe', layers: [
    ['head/heads/human/female_elderly', 'body:taupe'], ['eyes/human/adult/default', 'eye:gray'], ['eyes/eyebrows/thin/adult', 'hair:white'],
    ['feet/shoes/basic', 'cloth:black'], ['legs/pants', 'cloth:gray'], ['torso/clothes/shortsleeve/tshirt', 'cloth:lavender'], ['hair/bob/adult', 'hair:white']] },
  { id: 'forastero', name: 'Forastero', body: 'male', skin: 'fur_black', layers: [
    ['head/heads/human/male', 'body:fur_black'],
    ['feet/boots/fold', 'cloth:black'], ['legs/pantaloons', 'cloth:charcoal'], ['torso/clothes/longsleeve/formal', 'cloth:charcoal'],
    ['torso/jacket/frock', 'file:black'], ['hat/cloth/hood/adult', 'cloth:black']] },
  { id: 'teniente', name: 'Teniente', body: 'female', skin: 'light', layers: [
    ['head/heads/human/female', 'body:light'], ['eyes/human/adult/default', 'eye:blue'], ['eyes/eyebrows/thin/adult', 'hair:blonde'],
    ['feet/shoes/basic', 'cloth:black'], ['legs/formal', 'cloth:navy'], ['torso/clothes/longsleeve/longsleeve', 'cloth:white'],
    ['hair/bob/adult', 'hair:blonde'], ['weapon/sword/arming/universal/fg', 'file:steel']] },
  { id: 'pirata', name: 'Pirata de Dorne', body: 'male', skin: 'olive', layers: [
    ['head/heads/human/male', 'body:olive'], ['eyes/human/adult/anger', 'eye:brown'], ['eyes/eyebrows/thick/adult', 'hair:black'],
    ['feet/boots/fold', 'cloth:black'], ['legs/pantaloons', 'cloth:black'], ['torso/clothes/sleeveless/sleeveless2', 'cloth:slate'],
    ['beards/beard/basic', 'hair:black'], ['hat/cloth/bandana2/adult', 'cloth:red']] },
];
