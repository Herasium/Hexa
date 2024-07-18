<script>
  import bg_waves from "$lib/img/bg_waves.svg"
</script>
<div id="blur" />
<img src={bg_waves} id="bg_waves"/>
<div class="background" />



<style>
        #bg_waves {
          bottom: 0;
          left: 0;
          position: fixed;
          height: auto;
          width: 100%;
        }

        .background {
            background: var(--background-data);
            width:100%;
            height:100%;
            position:fixed;
            top: 0;
            left:0;
            z-index: -7;
        }
        #blur {
            backdrop-filter: blur(var(--background-blur));
            z-index: -5;
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
        }
        
        .elipse {
            border-radius: 458px;
            width: 458px;
            height: 458px;
            z-index: -6;
            display: var(--background-elipse-display);
            position: fixed;
        }
        
        #e-1 {
            background: var(--background-elipse-1-color);
            top:0;
            left:0;
        }
        
        #e-2 {
            background: var(--background-elipse-2-color);
            bottom: 0;
            right:0;
        }
        @media screen and (max-width: 1270px){
            #blur {
              height: 100%;
            }
            .elipse {
              height: 56vw;
              width: 56vw;
            }
          }
        @media screen and (max-width: 425px){
            .elipse {
              height: 76vw;
              width: 100%;
            }
            #e-1 {
            top:0;
            left:0;
            }
            
            #e-2 {
                bottom: 0;
                right:0;
            }
        }
</style>