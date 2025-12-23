"use client";

export default function Search() {
  return (
    <a className="headerSearch" href="/search" style="display: none;">
      <div className="details">
        <div
          className="headerSummary"
          role="searchbox"
          aria-haspopup="dialog"
          aria-label="Search"
        >
          <span>
            <span className="searchSvgWrapper">
              <svg
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2720_94)">
                  <path
                    d="M8.81222 16.2846C12.8161 16.2846 16.0619 13.0388 16.0619 9.03488C16.0619 5.03097 12.8161 1.78516 8.81222 1.78516C4.80831 1.78516 1.5625 5.03097 1.5625 9.03488C1.5625 13.0388 4.80831 16.2846 8.81222 16.2846Z"
                    stroke="black"
                    strokeWidth="1.24"
                  />
                  <path
                    d="M14.125 14.3477L19.2396 19.4623"
                    stroke="black"
                    strokeWidth="1.24"
                    strokeLinecap="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2720_94">
                    <rect
                      width="20"
                      height="20"
                      fill="white"
                      transform="translate(0.789062 0.316406)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <span className="searchSvgWrapper close">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.875 19.1484 L19.0937 0.929688 M19.0938 19.1484 L0.875 0.929688"
                  stroke="black"
                  strokeWidth="1.24"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </span>
        </div>
        <div
          className="search-modal modal__content gradient"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div className="modal-overlay"></div>
          <div className="search-modal__content" tabindex="-1">
            <predictive-search
              className="search-modal__form"
              data-loading-text="Loading"
            >
              <form
                action="{{ routes.search_url }}"
                method="get"
                role="search"
                className="search search-modal__form"
              >
                <div className="field">
                  <label className="field__label" for="{{ input_id }}">
                    Search for what you need
                  </label>
                  <div className="searchFormCtn">
                    <input
                      className="search__input field__input"
                      id="{{ input_id }}"
                      type="search"
                      name="q"
                      value="{{ search.terms | escape }}"
                      placeholder="Search"
                      role="combobox"
                      aria-expanded="false"
                      aria-owns="predictive-search-results"
                      aria-controls="predictive-search-results"
                      aria-haspopup="listbox"
                      aria-autocomplete="list"
                      autocorrect="off"
                      autocomplete="off"
                      autocapitalize="off"
                      spellcheck="false"
                    />
                    <input type="hidden" name="options[prefix]" value="last" />
                    <button
                      className="search__button field__button"
                      aria-label="Search"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </predictive-search>
          </div>
        </div>
      </div>
    </a>
  );
}
