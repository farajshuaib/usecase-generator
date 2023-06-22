<script setup lang="ts">
import { watch, ref } from "vue";
import { generateUseCase } from './generatUseCase'
import { getElementColor } from './functions'

const jsonFile = ref<File>();
const swagger = ref<Swagger>();
const formatedAPIs = ref<ReqestContent[]>([]);
const selectedApi = ref<string>("");
const jsonTextarea = ref<string>("");
const responseProps = ref<any>();



const setSelectedApi = (path: any) => {
  selectedApi.value = selectedApi.value ==  path  ? "" : path ; 
};


const submitFile = () => {
  if (!jsonFile.value && !jsonTextarea.value) {
    alert("Please select a file or paste your jsonTextarea file");
    return;
  }
  if (jsonFile.value) {
    const reader = new FileReader();
    reader.readAsText(jsonFile.value, "UTF-8");
    reader.onload = (evt) => {
      jsonTextarea.value = evt.target?.result as string;
      swagger.value = JSON.parse(jsonTextarea.value);
    };
    reader.onerror = (evt) => {
      console.log("error reading file" + evt.target?.result);
    };
  } else {
    swagger.value = JSON.parse(jsonTextarea.value);
  }
};


const handleFileUpload = (event: any) => {
  jsonFile.value = event.target.files[0];
};


watch(swagger, (newVal) => {
  if (!newVal) return;   
  for(const [pathKey, pathBody] of Object.entries(newVal.paths)){
    for(const [reqMethod, reqBody] of Object.entries(pathBody)){

      // const resRef = reqBody.responses["200"].schema?.$ref.split("/").pop() as string
      
      // const responseProperities = getResponseProp(swagger.value, resRef);  

      // console.log('resProp', responseProperities);
      
        const req: ReqestContent = {
          method: reqMethod as RequestMethod,
          url:pathKey,
          boadyParamns: reqBody.parameters.filter((item: any) => item.in === 'body').map((item: any) => ({name:item.name, type:item.type})),
          queryParamns: reqBody.parameters.filter((item: any) => item.in === 'query').map((item: any) => ({name:item.name, type:item.type})),
          operationId: reqBody.operationId,
          response: {}
        };

        formatedAPIs.value.push(req);
    }
  }

});
 




</script>
<template>
  <main class="container px-5 mx-auto">
    <div class="my-8">
      <div class="flex items-center justify-between">
        <label class="flex items-end justify-start gap-2 mb-2 " for="jsonTextarea">
          <img src="https://masarat.ly//ms_uploads/2021/12/masarat-logo-colored.svg" alt="" />
          <span class="text-xl font-medium text-gray-600 ">
            Swagger jsonTextarea file
          </span>
        </label>
        <div class="flex items-center gap-2 text-gray-600">
          <span v-if="jsonFile">{{jsonFile.name}}</span>
          <label for="jsonFile" class="px-4 py-2 text-white bg-[#002b36] rounded-lg">
           {{jsonFile ?  'Imported Successfully' : ' Import Swager jsonTextarea file'}}
          </label>
          <input id="jsonFile" @change="
            (event) => {
              handleFileUpload(event);
            }
          " name="jsonFile" type="file" class="hidden" accept="*/jsonTextarea" />
        </div>

      </div>
      <textarea id="jsonTextarea" name="jsonTextarea" class="w-full h-56 bg-[#002b36]  text-white rounded-lg p-5 my-5" v-model="jsonTextarea"
        row="10" placeholder="Paste your jsonTextarea file here " />

      <button class="px-4 py-2 text-white bg-[#002b36] rounded-lg" @click="submitFile">
        Submit
      </button>
      
    </div>
    <div v-if="swagger" class="py-5">
      <div v-if="swagger?.info"
        class="flex items-center justify-between px-5 py-3 my-5 text-white bg-blue-500 rounded-xl">
        <span>{{ swagger.info?.title }}</span>
        <span>{{ swagger.info?.version }}</span>
      </div>

      <ul class="flex flex-col gap-2">
        <li v-for="req in formatedAPIs" @click="() => setSelectedApi(req.url)" :key="req.url"
          class="px-5 py-2 border rounded-lg cursor-pointer"
          :class="getElementColor(req.method)">
          <p class="flex items-center justify-between">
          <p class="flex items-center justify-start gap-2">
            <span class="px-3 py-1 text-xs text-white align-middle bg-gray-700 rounded-lg">{{
              req.method
            }}</span>
            <span>{{ req.url }}</span>
          </p>
          <button class="px-5 py-2 text-sm text-white bg-[#002b36] rounded-lg"
            @click="() => generateUseCase(req.url as string, req)">Generate</button>
          </p>
          <ul v-if="
            selectedApi === req.url
          " class="flex flex-col gap-3">
            <span class="my-5 text-xs text-gray-600">Query Parameter:</span>
            <li v-for="(param, index) in req.queryParamns" :key="index" class="flex items-center gap-1">
              <span> {{ param.name }}: </span>
              <span>
                {{ param.type }}
              </span>
            </li>
            <span class="my-5 text-xs text-gray-600">Body Parameter:</span>
            <li v-for="(param, index) in req.queryParamns" :key="index" class="flex items-center gap-1">
              <span> {{ param.name }}: </span>
              <span>
                {{ param.type }}
              </span>
            </li>

            <div v-if="responseProps" class="mt-8">
              <span class="mt-5 text-xs text-gray-600">Response:</span>
              
            </div>
          </ul>
        </li>
      </ul>
    </div>
  </main>
</template>

<style >
textarea::-webkit-scrollbar {
  width: 12px;
  /* width of the entire scrollbar */
}

textarea::-webkit-scrollbar-track {
  background: white;
  /* color of the tracking area */
}

textarea::-webkit-scrollbar-thumb {
  background-color: #578894;
  /* color of the scroll thumb */
  border-radius: 20px;
  /* roundness of the scroll thumb */
  height: 60px;
}</style>
