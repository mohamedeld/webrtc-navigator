const videoEl = document.querySelector('#my-video');
const audioInputEl = document.querySelector('#audio-input');
const audioOnputEl = document.querySelector('#audio-output');
const videoChangeEl = document.querySelector('#video-input');
let stream= null;
let mediaScreen = null;
const constraints = {
  video:true,
  audio:true
}

async function getDevices(){
  try{
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices)
    devices.forEach(device=>{
      const optionEl = document.createElement('option');
      optionEl.value = device?.deviceId;
      optionEl.text = device?.label;
      if(device?.kind === "audioinput"){
        audioInputEl.appendChild(optionEl)
      }else if(device?.kind === "audiooutput"){
        audioOnputEl.appendChild(optionEl)
      }else if(device?.kind === "videoinput"){
        videoChangeEl.appendChild(optionEl)
      }
    })
  }catch(error){
    console.log(error);
  }
}
getDevices()
const getMicAndCamera = async (e)=>{
  try{
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    //getDevices();
  }catch(error){
    console.log("user denied access to constraints")
  }
}
const showFeed = (e)=>{
  videoEl.srcObject = stream;
}
const stopFeed = (e)=>{
  const tracks = stream.getTracks();
  tracks.forEach(track=>{
    track.stop();
  })
}
let mediaRecorder;
let recordedData;
const startRecording = ()=>{
   recordedData = [];
   mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = e=>{
    console.log("data is available in recorded data")
    recordedData.push(e.data)
  }
  mediaRecorder.start();
} 

const stopRecording = ()=>{
  mediaRecorder.stop();
}

const shareScreen = async()=>{
  try{
    const options = {
      video:true,
      audio:false,
      surfaceSwitching:'include'
    }
    mediaScreen = await navigator.mediaDevices.getDisplayMedia(options)
  }catch(error){
    console.log(error);
  }
}
async function changeAudioInput(e){
  const deviceId = e.target.value; 
  const constraints = {
    audio:{deviceId:{exact:deviceId}},
    video:true
  }
  try{
    stream = await navigator.mediaDevices.getUserMedia(constraints)
    const tracks = stream.getAudioTracks();
    console.log(tracks)
  }catch(error){
    console.log(error);
  }
}
async function changeAudioOnput(e){
  await videoEl.setSinkId(e.target.value)
  console.log("change aduio device")

}
async function changeVideo(e){
  const deviceId = e.target.value;
  const constraints ={
    audio:true,
    video:{deviceId:{exact:deviceId}}
  }
  try{
    stream = await navigator.mediaDevices.getUserMedia(constraints)
    const tracks = stream.getVideoTracks();
    console.log(tracks)
  }catch(error){
    console.log(error);
  }
}
const playRecording = ()=>{
  const superBuffer = new Blob(recordedData);
  const recordedVideoEl = document.querySelector('#other-video');
  recordedVideoEl.src = window.URL.createObjectURL(superBuffer);
  recordedVideoEl.controls = true;
  recordedVideoEl.play();
}

document.querySelector('#share').addEventListener('click',(e)=> getMicAndCamera(e))

document.querySelector('#show-video').addEventListener('click',(e)=> showFeed(e));


document.querySelector("#stop-video").addEventListener('click',(e)=> stopFeed(e))
document.querySelector('#start-record').addEventListener('click',(e)=> startRecording())
document.querySelector('#stop-record').addEventListener('click',(e)=> stopRecording())
document.querySelector('#play-record').addEventListener('click',(e)=> playRecording())
document.querySelector('#share-screen').addEventListener('click',(e)=> shareScreen())

document.querySelector('#audio-input').addEventListener('change',(e)=> changeAudioInput(e))
document.querySelector('#audio-output').addEventListener('change',(e)=> changeAudioOnput(e))
document.querySelector('#video-input').addEventListener('change',(e)=> changeVideo(e))