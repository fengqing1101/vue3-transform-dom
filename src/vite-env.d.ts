/// <reference types="vite/client" />
declare module "*.vue" {
  import { App, defineComponent } from "vue";
  const component: ReturnType<typeof defineComponent> & {
    install(app: App): void;
  };
  export default component;
}

interface ImportMetaEnv {
  /**
   * 服务端请求基地址
   */
  VITE_SERVER_URL: string;
}


interface ImportMeta {
  readonly env: ImportMetaEnv
}