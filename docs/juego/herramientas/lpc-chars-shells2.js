// Shells Town, ronda 2: diseños propios para quien antes reutilizaba un sprite de Kalé. Mismo formato que lpc-chars.js.
const MAR = (id, name, skin, hair, eye, extra = [], body = 'male') => ({ id, name, body, skin, layers: [
  ['head/heads/human/' + (body === 'female' ? 'female' : 'male'), 'body:' + skin], ['eyes/human/adult/neutral', 'eye:' + eye], ['eyes/eyebrows/thick/adult', 'hair:' + hair],
  ['feet/shoes/basic', 'cloth:black'], ['legs/pants', 'cloth:white'], ['torso/clothes/longsleeve/longsleeve2_vneck', 'cloth:white'], ...extra, ['code:collar'], ['code:marinecap']] });
module.exports = [
  { id: 's_pipo', name: 'Pipo Vidal', body: 'child', skin: 'bronze', layers: [
    ['head/heads/human/child', 'body:bronze'], ['legs/pants/child', 'file:brown'],
    ['torso/clothes/shirt/child', 'file:white'], ['hair/wavy/child', 'hair:black'], ['hat/headband/thick/child', 'cloth:navy']] },
  { id: 's_lalo', name: 'Lalo', body: 'male', skin: 'olive', layers: [
    ['head/heads/human/male_gaunt', 'body:olive'], ['eyes/human/adult/default', 'eye:brown'], ['eyes/eyebrows/thick/adult', 'hair:gray'],
    ['feet/sandals', 'cloth:brown'], ['legs/pantaloons', 'cloth:tan'], ['torso/clothes/longsleeve/longsleeve2_buttoned', 'cloth:forest'],
    ['beards/beard/basic', 'hair:gray'], ['hair/plain/adult', 'hair:gray'], ['hat/cloth/leather_cap/adult', 'file:walnut']] },
  { id: 's_marta', name: 'Marta', body: 'female', skin: 'light', layers: [
    ['head/heads/human/female', 'body:light'], ['eyes/human/adult/default', 'eye:blue'], ['eyes/eyebrows/thin/adult', 'hair:carrot'],
    ['feet/boots/fold', 'cloth:black'], ['legs/pants', 'cloth:charcoal'], ['torso/clothes/longsleeve/longsleeve2_scoop', 'cloth:teal'], ['torso/aprons/apron', 'file:brown'],
    ['hair/half_up/adult', 'hair:carrot']] },
  { id: 's_amaro', name: 'Viuda Amaro', body: 'female', skin: 'light', layers: [
    ['head/heads/human/female_elderly', 'body:light'], ['eyes/human/adult/default', 'eye:brown'], ['eyes/eyebrows/thin/adult', 'hair:gray'],
    ['feet/shoes/basic', 'cloth:black'], ['legs/pants', 'cloth:black'], ['torso/clothes/longsleeve/longsleeve2_cardigan', 'cloth:black'],
    ['hair/bangs_bun/adult', 'hair:gray']] },
  { id: 's_celes', name: 'Doña Celes', body: 'female', skin: 'taupe', layers: [
    ['head/heads/human/female', 'body:taupe'], ['eyes/human/adult/default', 'eye:brown'], ['eyes/eyebrows/thin/adult', 'hair:dark_brown'],
    ['feet/shoes/basic', 'cloth:brown'], ['legs/pants', 'cloth:navy'], ['torso/clothes/blouse_longsleeve', 'file:white'], ['torso/clothes/corset', 'file:maroon'],
    ['hair/loose/adult', 'hair:dark_brown'], ['hat/headband/hairtie/adult', 'cloth:rose']] },
  { id: 's_marinera', name: 'Marinera de la Tortuga', body: 'female', skin: 'black', layers: [
    ['head/heads/human/female', 'body:black'], ['eyes/human/adult/default', 'eye:brown'], ['eyes/eyebrows/thin/adult', 'hair:black'],
    ['feet/boots/fold', 'cloth:leather'], ['legs/pantaloons', 'cloth:bluegray'], ['torso/clothes/sleeveless/tanktop', 'file:white'],
    ['hair/twists_straight/adult', 'hair:black'], ['hat/pirate/kerchief/adult', 'cloth:red']] },
  { id: 's_bruto', name: 'Bruto', body: 'muscular', skin: 'light', layers: [
    ['head/heads/human/male', 'body:light'], ['eyes/human/adult/anger', 'eye:gray'], ['eyes/eyebrows/thick/adult', 'hair:carrot'],
    ['feet/boots/fold', 'cloth:brown'], ['legs/pantaloons', 'cloth:charcoal'], ['torso/clothes/sleeveless/striped', 'file:red'],
    ['beards/beard/basic', 'hair:carrot'], ['hair/longhawk/adult', 'hair:carrot']] },
  { id: 's_pardo', name: 'Sargento Pardo', body: 'muscular', skin: 'black', layers: [
    ['head/heads/human/male', 'body:black'], ['eyes/human/adult/default', 'eye:brown'], ['eyes/eyebrows/thick/adult', 'hair:gray'],
    ['feet/boots/fold', 'cloth:black'], ['legs/pants', 'cloth:white'], ['torso/clothes/longsleeve/longsleeve', 'cloth:white'],
    ['beards/beard/basic', 'hair:gray'], ['shoulders/epaulets', 'cloth:yellow'], ['code:collar'], ['code:marinecap:oro']] },
  { id: 's_ruiz', name: 'Cabo Ruiz', body: 'male', skin: 'light', layers: [
    ['head/heads/human/male', 'body:light'], ['eyes/human/adult/default', 'eye:green'], ['eyes/eyebrows/thick/adult', 'hair:ginger'],
    ['feet/shoes/basic', 'cloth:black'], ['legs/pants', 'cloth:white'], ['torso/clothes/shortsleeve/tshirt_vneck', 'cloth:white'],
    ['beards/mustache/basic', 'hair:ginger'], ['hair/messy2/adult', 'hair:ginger'], ['code:collar']] },
  MAR('s_marine_a', 'Marine', 'brown', 'black', 'brown'),
  MAR('s_marine_b', 'Marine', 'olive', 'dark_brown', 'brown', [['beards/mustache/basic', 'hair:dark_brown']]),
  MAR('s_marine_c', 'Marine', 'black', 'black', 'brown'),
  MAR('s_marine_d', 'Marine', 'bronze', 'black', 'gray', [['hair/long_straight/adult', 'hair:black']], 'female'),
  MAR('s_marine_e', 'Marine', 'amber', 'sandy', 'blue', [['beards/beard/basic', 'hair:sandy']]),
  { id: 's_clara', name: 'Clara Sastre', body: 'female', skin: 'light', layers: [
    ['head/heads/human/female', 'body:light'], ['eyes/human/adult/default', 'eye:green'], ['eyes/eyebrows/thin/adult', 'hair:sandy'],
    ['feet/sandals', 'cloth:brown'], ['legs/pants', 'cloth:tan'], ['torso/clothes/shortsleeve/tshirt_scoop', 'cloth:lavender'],
    ['hair/pigtails/adult', 'hair:sandy']] },
  { id: 's_goyo', name: 'Goyo', body: 'male', skin: 'taupe', layers: [
    ['head/heads/human/male_plump', 'body:taupe'], ['eyes/human/adult/default', 'eye:brown'], ['eyes/eyebrows/thick/adult', 'hair:dark_brown'],
    ['feet/boots/fold', 'cloth:brown'], ['legs/pants', 'cloth:brown'], ['torso/clothes/sleeveless/sleeveless2_buttoned', 'cloth:tan'],
    ['beards/beard/basic', 'hair:dark_brown'], ['hair/bedhead/adult', 'hair:dark_brown'], ['hat/cloth/bandana2/adult', 'cloth:bluegray']] },
];
