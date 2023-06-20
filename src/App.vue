<script setup lang="ts">
import { nextTick, ref } from "vue";
import { generateUseCase } from './generatUseCase'
import { getRequestData, getRequestMethod, getElementColor } from './functions'

const jsonFile = ref<File>();
const swagger = ref<Swagger>();
const selectedApi = ref<SwaggerPathOptions | null>(null);
const json = ref<string>("");
const responseProps = ref<any>();



const getResponseProp = (resDef: string) => {
  const def = swagger.value?.definitions[resDef]
  console.log(def);
  
  let properties 
  
    if(def && Object.hasOwnProperty.call(def, 'allOf')) {      
       getResponseProp(def?.allOf[1]?.properties.content.$ref.split("/").pop() as string);
      
       
    } else {    
      console.log('here');
      properties = def?.properties
    }

    console.log(properties);
    
  return properties
}



const setSelectedApi = (value: any) => {
  if(!value) return
  const reqData = getRequestData(value) as SwaggerPathOptions;
  if(!reqData) return
  selectedApi.value = selectedApi.value ? null : reqData ;
  const responseRef = reqData.responses["200"].schema?.$ref.split("/").pop() as string
  if(!responseRef) return
  const resProp = getResponseProp(responseRef);  
  if(!resProp) return
  responseProps.value = resProp
  
};


const submitFile = () => {
  if (!jsonFile.value && !json.value) {
    alert("Please select a file or paste your json file");
    return;
  }
  if (jsonFile.value) {
    const reader = new FileReader();
    reader.readAsText(jsonFile.value, "UTF-8");
    reader.onload = (evt) => {
      json.value = evt.target?.result as string;
      swagger.value = JSON.parse(json.value);
    };
    reader.onerror = (evt) => {
      console.log("error reading file" + evt.target?.result);
    };
  } else {
    swagger.value = JSON.parse(json.value);
  }
};


const handleFileUpload = (event: any) => {
  jsonFile.value = event.target.files[0];

};



</script>
<template>
  <main class="container px-5 mx-auto">
    <div class="my-8">
      <div class="flex items-center justify-between">
        <label class="flex items-end justify-start gap-2 mb-2 " for="json">
          <img src="https://masarat.ly//ms_uploads/2021/12/masarat-logo-colored.svg" alt="" />
          <span class="text-xl font-medium text-gray-600 ">
            Swagger json file
          </span>
        </label>
        <div class="flex items-center gap-2 text-gray-600">
          <span v-if="jsonFile">{{jsonFile.name}}</span>
          <label for="jsonFile" class="px-4 py-2 text-white bg-[#002b36] rounded-lg">
           {{jsonFile ?  'Imported Successfully' : ' Import Swager json file'}}
          </label>
          <input id="jsonFile" @change="
            (event) => {
              handleFileUpload(event);
            }
          " name="jsonFile" type="file" class="hidden" accept="*/json" />
        </div>

      </div>
      <textarea id="json" name="json" class="w-full h-56 bg-[#002b36]  text-white rounded-lg p-5 my-5" v-model="json"
        row="10" placeholder="Paste your json file here " />

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
        <li v-for="[key, value] in Object.entries(swagger?.paths)" @click="() => setSelectedApi(value)" :key="key"
          class="px-5 py-2 border rounded-lg cursor-pointer"
          :class="getElementColor(getRequestMethod(value) as RequestMethod)">
          <p class="flex items-center justify-between">
          <p class="flex items-center justify-start gap-2">
            <span class="px-3 py-1 text-xs text-white align-middle bg-gray-700 rounded-lg">{{
              getRequestMethod(value)
            }}</span>
            <span>{{ key }}</span>
          </p>
          <button class="px-5 py-2 text-sm text-white bg-[#002b36] rounded-lg"
            @click="() => generateUseCase(key as string, value)">Generate</button>
          </p>
          <ul v-if="
            JSON.stringify(selectedApi) ==
            JSON.stringify(getRequestData(value))
          " class="flex flex-col gap-3">
            <span class="mt-5 text-xs text-gray-600">Parameter:</span>
            <li v-for="(param, index) in selectedApi?.parameters" :key="index" class="flex items-center gap-1">
              <span> {{ param.name }}: </span>
              <span>
                {{ param.type }}
              </span>
            </li>

            <div v-if="responseProps" class="mt-8">
              <span class="mt-5 text-xs text-gray-600">Response:</span>
              <li v-for="[prop, value] in Object.entries(responseProps)" :key="prop" class="flex items-center gap-1">
                <span> {{ prop }}: </span>
                <span>
                  <!-- {{ value?.type ? value?.type : getResponseProp(value.$ref.split("/").pop()) }} -->
                </span>
              </li>
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
