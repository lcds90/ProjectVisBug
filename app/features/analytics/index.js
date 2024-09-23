import $ from "blingblingjs";
import hotkeys from "hotkeys-js";
import { querySelectorAllDeep } from "query-selector-shadow-dom";
import { PluginRegistry, PluginHints } from "../../plugins/_registry.js";
import { notList } from "../../utilities/index.js";
import { isFirefox } from "../../utilities/cross-browser.js";
import {
  contentCopy,
  download,
  upload,
} from "../../components/vis-bug/vis-bug.icons.js";

const selectorsInLocalStorage = JSON.parse(
  localStorage.getItem("selectors") || "[]"
);

// create input
const search_base = document.createElement("div");
search_base.classList.add("search");
search_base.innerHTML = `
  <input list="visbug-web-analytics-list" type="search" placeholder="Enter the attribute to find"/>
  <datalist id="visbug-web-analytics-list">
    ${selectorsInLocalStorage.reduce(
      (options, selector) =>
        (options +=
          isFirefox > 0
            ? `<option value="${selector}">`
            : `<option value="${selector}">${selector}`),
      ""
    )}
  </datalist>
  
`;

const buttonShowNotMapped = document.createElement("div");
buttonShowNotMapped.classList.add("analytics");
buttonShowNotMapped.innerHTML = `
        <button class="load" title="Carregar pré-definição de seletores">
          ${upload}
        </button>
        <button class="analytics-download" title="Baixar seletores">
        ${download}
        </button>
        <button class="analytics-copy-all" title="Copiar seletores" disabled>
          ${contentCopy}
        </button>
`;
search_base.appendChild(buttonShowNotMapped);

const search = $(search_base);
const searchInput = $("input", search_base);

const showSearchBar = () => search.attr("style", "display:block");
const hideSearchBar = () => search.attr("style", "display:none");
const stopBubbling = (e) => e.key != "Escape" && e.stopPropagation();

export function Analytics({ node, visbug }) {
  if (node) node[0].appendChild(search[0]);

  const onQuery = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const query = e.target.value;

    window.requestIdleCallback((_) => queryPage(query, visbug));
  };

  const focus = (e) => searchInput[0].focus();

  searchInput.on("click", focus);
  searchInput.on("input", onQuery);
  searchInput.on("keydown", stopBubbling);
  // searchInput.on('blur', hideSearchBar)

  showSearchBar();
  focus();

  // hotkeys('escape,esc', (e, handler) => {
  //   hideSearchBar()
  //   hotkeys.unbind('escape,esc')
  // })

  return () => {
    hideSearchBar();
    searchInput.off("oninput", onQuery);
    searchInput.off("keydown", stopBubbling);
    searchInput.off("blur", hideSearchBar);
  };
}

export function queryPage(query, SelectorEngine) {
  console.log(query, SelectorEngine);
  if (!query) return SelectorEngine.unselect_all();
  if (query == "." || query == "#" || query.trim().endsWith(",")) return;

  try {
    let matches = querySelectorAllDeep(query + notList);
    if (!matches.length) matches = querySelectorAllDeep(query);
    if (matches.length) {
      matches.forEach((el) => {
        SelectorEngine.select(el);
      });
    }
  } catch (err) {}
}
