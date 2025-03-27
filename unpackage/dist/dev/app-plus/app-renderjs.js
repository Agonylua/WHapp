var __renderjsModules={};

__renderjsModules["2dccaea8"] = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <stdin>
  var stdin_exports = {};
  __export(stdin_exports, {
    default: () => stdin_default
  });
  var stdin_default = {
    data() {
      return {};
    },
    mounted() {
    },
    methods: {
      createFileInputDom(e, ownerVm) {
        let fileInput = document.createElement("input");
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "*");
        fileInput.click();
        fileInput.addEventListener("change", (e2) => {
          let file = e2.target.files[0];
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function(event) {
            const base64Str = event.target.result;
            ownerVm.callMethod("parseJSONData", base64Str);
          };
        });
      }
    }
  };
  return __toCommonJS(stdin_exports);
})();
