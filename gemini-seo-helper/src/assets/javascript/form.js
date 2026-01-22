import { GoogleGenAI } from "@google/genai";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyBhbTBcIm5kPPUQef6SsOIcD1Qnrw605UE",
});

export class ContentForm {
  #searchInput;
  #contentInput;
  #form;

  constructor() {
    this.#form = document.querySelector("#content-form");
    this.#searchInput = document.querySelector("#seo-search");
    this.#contentInput = document.querySelector("#content");

    this.#form.addEventListener("submit", (event) => this.#submit(event, this));
  }

  async #request(terms) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: terms,
    });

    // hiding the loader modal whn receiving the response
    let modal = document.querySelector("div.modal");
    modal.style.display = "none";

    // preparing the section for inserting the response
    let section = document.querySelector("#gemini-answer");
    section.scrollIntoView();

    // load the markdown turned html in the section
    section.innerHTML = marked.parse(response.text);
  }

  #submit(event, that) {
    event.preventDefault();
    let modal = document.querySelector("div.modal");
    modal.style.display = "grid";
    let search = that.#searchInput.value;
    let content = that.#contentInput.value;

    let terms = `Bonjour, pourrais-tu me calculer un score SEO pour un contenu que je vais
        t'envoyer en format Markdown. Les termes de recherches pour lesquels calculer sont les suivants : ${search}.
        Le contenu est le suivant : ${content}. J'aurais besoin d'une réponse synthétique au format Markdown avec un score sur 20. Merci !`;

    // call our async method
    that.#request(terms);
  }
}
