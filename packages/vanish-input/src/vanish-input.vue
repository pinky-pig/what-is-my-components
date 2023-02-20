<script setup lang="ts">
import html2canvas from 'html2canvas'
import { onMounted, ref } from 'vue'
import { ExplodingParticle } from '..'

let particles: any[] = []
function createParticleAtPoint(x: any, y: any, colorData: any) {
  const particle = new (ExplodingParticle as any)()
  particle.rgbArray = colorData
  particle.startX = x
  particle.startY = y
  particle.startTime = Date.now()
  particles.push(particle)
}

let btnCtx: CanvasRenderingContext2D | null
const reductionFactor = 17
const handleBtnClick = (e: any) => {
  // Get our color data like before
  const localX = e.offsetX
  const localY = e.offsetY
  const rgbaColorArr = (btnCtx as CanvasRenderingContext2D).getImageData(localX, localY, 1, 1).data

  const bcr = e.target.getBoundingClientRect()
  const globalX = bcr.left + localX
  const globalY = bcr.top + localY

  createParticleAtPoint(globalX, globalY, rgbaColorArr)

  // const width = e.target.offsetWidth
  // const height = e.target.offsetHeight
  // const colorData = (btnCtx as CanvasRenderingContext2D).getImageData(0, 0, width, height).data

  // // Keep track of how many times we've iterated (in order to reduce
  // // the total number of particles create)
  // let count = 0

  // // Go through every location of our button and create a particle
  // for (let localX = 0; localX < width; localX++) {
  //   for (let localY = 0; localY < height; localY++) {
  //     if (count % reductionFactor === 0) {
  //       const index = (localY * width + localX) * 4
  //       const rgbaColorArr = colorData.slice(index, index + 4)

  //       const bcr = e.target.getBoundingClientRect()
  //       const globalX = bcr.left + localX
  //       const globalY = bcr.top + localY

  //       createParticleAtPoint(globalX, globalY, rgbaColorArr)
  //     }
  //     count++
  //   }
  // }
}

const btnRef = ref<HTMLElement | null>(null)
const particleCanvas = ref<any | null>(null)
onMounted(() => {
  // const btn = document.querySelector('button')
  // const btn = document.getElementById('btn')
  if (!btnRef.value)
    return
  html2canvas(btnRef.value).then((canvas) => {
    btnCtx = canvas.getContext('2d')
    createParticleCanvas()
  })

  let particleCanvas, particleCtx: CanvasRenderingContext2D | null
  function createParticleCanvas() {
    // Create our canvas
    particleCanvas = document.createElement('canvas')
    particleCtx = particleCanvas.getContext('2d')

    // Size our canvas
    particleCanvas.width = window.innerWidth
    particleCanvas.height = window.innerHeight

    // Position out canvas
    particleCanvas.style.position = 'absolute'
    particleCanvas.style.top = '0'
    particleCanvas.style.left = '0'

    // Make sure it's on top of other elements
    particleCanvas.style.zIndex = '1001'

    // Make sure other elements under it are clickable
    particleCanvas.style.pointerEvents = 'none'

    // Add our canvas to the page
    document.body.appendChild(particleCanvas)
  }

  function update() {
    // Clear out the old particles
    if (typeof particleCtx !== 'undefined' && particleCtx)
      particleCtx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    // Draw all of our particles in their new location
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw(particleCtx)

      // Simple way to clean up if the last particle is done animating
      if (i === particles.length - 1) {
        const percent = (Date.now() - particles[i].startTime) / particles[i].animationDuration

        if (percent > 1)
          particles = []
      }
    }

    // Animate performantly
    window.requestAnimationFrame(update)
  }
  window.requestAnimationFrame(update)
})
</script>

<template>
  <div class="container">
    <button id="btn" ref="btnRef" @click="handleBtnClick">
      Button
    </button>
    <Teleport to="body">
      <canvas ref="particleCanvas" class="expold-canvas" />
    </Teleport>
  </div>
</template>

<style  scoped>
.container{
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  place-items: center;
  width: 100vw;
  height: 100vh;
}

.expold-canvas{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1001;
  pointer-events: none;
  width: 100vw;
  height: 100vh;
}
button {
  min-width: 135px;
  max-width: 200px;
  min-height: 50px;
  border: 0;
  outline: 0;

  color: white;

  /* pink to orange */
  background: #ee0979;
  background: linear-gradient(to right, #ee0979, #ff6a00);

  vertical-align: top;
}

button {
  cursor: pointer;
}
</style>
