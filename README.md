# Candy Catcher 

its halloween night and you are a pumpkin bucket trying to collect as much candy as possible. the problem is the spiders are dropping down too and nobody wants a spider in their candy. catch the candy, dodge the spiders, and try to get a high score!!

## how to play

1. click (or press space / enter) to start
2. move the pumpkin bucket left and right:
   - **arrow keys** or **A and D** on a keyboard
   - or **hold the mouse** and the bucket follows it (this works with your finger on a phone too!)
3. catch the colorful candy for **+1 point**
4. catch the shiny **gold candy** for **+5 points** (its rare so grab it!!)
5. dont catch the **spiders**!! every spider you catch takes away a life and the screen flashes red. you only have **3 lives** (the little pumpkins in the top right)
6. if you miss a candy nothing bad happens, only the spiders matter
7. the more candy you get the faster everything falls and the faster new stuff shows up, so it gets crazy
8. when you run out of lives you see your score and your best score. click to try again!

tip: the spiders have red eyes and wiggly legs so look out for those. and dont get greedy chasing the gold candy when there is a spider next to itt

## how i made it

i used the Ghost Ship guide and kept the same idea of having a `state` variable that is `'start'`, `'play'` or `'over'`. then i changed a lot of stuff so it is a different game:

- **the screen:** 480 x 360 canvas with the dark purple background from the guide
- **moving the player:** `keyIsDown()` checks if the arrow keys or A / D are being held. i also used `mouseIsPressed` and `lerp()` so the bucket slides to the mouse smoothly
- **falling stuff:** every candy and spider is an object like `{ x, y, type, speed }` and i keep them all in an array called `things`. every frame i make them go down by adding to `y`
- **catching:** i check if the thing is at the same height as the bucket and if its close enough to the bucket on the x axis using `abs()`. if yes it gets caught and i remove it with `splice()`
- **random stuff:** `random()` picks where things spawn, how fast they fall and what kind of thing it is (60% candy, 30% spider, 10% gold)
- **getting harder:** the score changes how fast stuff falls and how often it spawns, so the game speeds up by itself
- **drawing:** everything is made from basic shapes (`ellipse()`, `triangle()`, `rect()`, `arc()`, `line()`)
  - the candy is an oval with two triangles for the wrapper and it spins using `rotate()`
  - the spider is two ovals with 8 lines for legs that wiggle with `sin()`
  - the pumpkin bucket is 3 ovals with a triangle face and an arc for the handle
- **particles:** when you catch something little dots fly out and fall down. i use the same array and `splice()` idea as before
- **the scene:** moon with craters, stars, a haunted house with windows that flicker (i used `noise()` for that so its not too jumpy), a dead tree made from lines, and fog
- **font:** Courier New because it looks kinda spooky and old

## things that went wrong

- at first the candy went through the bucket and nothing happened. my catch check was wrong because i forgot the bucket is near the bottom of the screen so i had to fix the y numbers
- the windows on the house flickered SO fast it looked like a disco. `noise()` fixed it
- the spiders were hard to see because the legs were black on a black background so i made them purple
- when you pressed space to restart the game sometimes started with spiders already falling. now i reset everything when a new game starts

## how to run it

**easy way:** open the link to the game and click

**p5.js editor way:**
1. go to [editor.p5js.org](https://editor.p5js.org/)
2. paste everything from `sketch.js` into the editor
3. press the play button

## credits

- made with [p5.js](https://p5js.org/)
- guide from [Ghost Ship](https://ghostship.hackclub.com/) in Ghostship workshop by hackclub
