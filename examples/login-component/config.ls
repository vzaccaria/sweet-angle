_module = ->

          
    iface = { 

      destination:'_site'
      
      remote:'simple-login'

      vendor-js:
          "./bower_components/underscore.string/lib/underscore.string.js"
          "./bower_components/jquery/dist/jquery.js"
          ...

      client-ls:
          "./assets/js/*.ls"
          ...

      client-html:
          "./assets/*.jade"
          "./assets/views/*.jade"
          ...

      client-less:
          './assets/less/*.less'
          ...

      vendor-css:
          './vendor/css/*.css'
          ...

      font-dir:'./assets/fonts'

      img-dir:'./assets/img'

      directives:[
          './assets/directives/*.sjs'
          ]

      data-to-be-copied:[
          "./data/*.json"
          "./assets/less/*.dss"
          ]


    }
  
    return iface
 
module.exports = _module()