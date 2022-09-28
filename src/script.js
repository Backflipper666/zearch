const search = document.getElementById('search');
const matchList = document.getElementById('match-list');
const chart = document.querySelector('.chart');

const searchStates = async (searchText) => {
  url3 = `https://api.github.com/search/repositories?q=${searchText}&per_page=5`;
  const res = await fetch(url3);
  const states = await res.json();
  console.log(states.items);
  let matches = states.items.filter((item) => {
    const regex = new RegExp(`^${searchText}`, 'gi');
    return item.name.match(regex || item.full_name.match(regex));
  });
  if (searchText.length === 0) {
    matches = [];
    matchList.innerHTML = '';
  }
  outputHtml(matches);
  console.log(matchList);
  console.log('matchList.children', matchList.childNodes);
  const kids = matchList.childNodes;
  for (let kid of kids) {
    kid.addEventListener('click', () => {
      const [name, owner, stars] = kid.textContent.split('-');
      console.log('name: ', name);
      console.log('owner: ', owner);
      console.log('stars: ', stars);
      // document.createElement('');
    });
  }
};

function outputHtml(matches) {
  if (matches.length > 0) {
    const html = matches
      .map(
        (match) => `
        <div class="card card-body mb-1"><p>${match.name}-${match.owner.login}-${match.stargazers_count}</p>
       
        </div>
        `
      )
      .join('');

    matchList.innerHTML = html;
  }
}

search.addEventListener('input', () => debouncedSearchStates(search.value));

const debounce = (func, delay = 500) => {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

const debouncedFn = debounce(outputHtml);

const debouncedSearchStates = debounce(searchStates);
