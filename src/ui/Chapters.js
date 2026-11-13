export const chapters=[
 {name:'THE VOID',title:'EVENT HORIZON',kicker:'A JOURNEY TO THE EDGE OF EVERYTHING',subtitle:'Beyond the Point of No Return.',caption:'Every journey begins in the dark.',start:0},
 {name:'THE APPROACH',title:'THE APPROACH',kicker:'02 / DRAWN INTO THE UNKNOWN',subtitle:'Where gravity begins to reshape the universe.',caption:'A little closer to the impossible.',start:.2},
 {name:'GRAVITY',title:'GRAVITY',kicker:'03 / THE ARCHITECTURE OF SPACETIME',subtitle:'Space bends. Light follows.',caption:'Nothing travels in a straight line here.',start:.4},
 {name:'POINT OF NO RETURN',title:'POINT OF<br>NO RETURN',kicker:'04 / THE LAST LIGHT',subtitle:'Beyond this boundary, no signal can escape.',caption:'The boundary between here and forever.',start:.65},
 {name:'THE UNKNOWN',title:'THE UNKNOWN',kicker:'05 / BEYOND OUR UNDERSTANDING',subtitle:'The universe still has secrets.',caption:'Some questions remain unanswered.',start:.85}
];
export function chapterAt(progress){let index=0;for(let i=1;i<chapters.length;i++)if(progress>=chapters[i].start)index=i;return index;}

export const chapterNotes=[
 "A distant glow emerges from the darkness. The shadow marks the paths of light that never return.",
 "The accretion disk is made of orbiting matter. As gas spirals inward, it heats up and emits light.",
 "Gravity curves light paths. The far side of the disk appears above and below the shadow; narrow photon-ring images form near its edge.",
 "The event horizon is a boundary in spacetime. Once crossed inward, no future-directed light signal can reach a distant observer.",
 "The interior sequence is an artistic interpretation. It is not an established picture of the inside of a black hole."
];
