const search = document.getElementById('search');
const matchList = document.getElementById('match-list');
const chart = document.querySelector('.chart');

const searchStates = async (searchText) => {
  url3 = `https://api.github.com/search/repositories?q=${searchText}&per_page=5`;
  const res = await fetch(url3);
  const states = await res.json();

  let matches = states.items.filter((item) => {
    const regex = new RegExp(`^${searchText}`, 'gi');
    return item.name.match(regex || item.full_name.match(regex));
  });
  if (searchText.length === 0) {
    matches = [];
    matchList.innerHTML = '';
  }
  outputHtml(matches);

  const kids = matchList.childNodes;
  for (let kid of kids) {
    kid.addEventListener('click', () => {
      const [name, owner, stars] = kid.textContent.split('-');
      addRepo(name, owner, stars);
    });
  }
};

function outputHtml(matches) {
  if (matches.length > 0) {
    const html = matches
      .map(
        (match) => `
        <div class="card card-body mb-0"><p class="para">${match.name}<i hidden>-${match.owner.login}-${match.stargazers_count}</i></p>
       
        </div>
        `
      )
      .join('');

    matchList.innerHTML = html;
  }
}

function addRepo(name, owner, stars) {
  const wrapper = document.createElement('div');
  const p = document.createElement('p');
  p.textContent = `Name: ${name}`;
  wrapper.append(p);

  const pOwner = document.createElement('p');
  pOwner.textContent = `Owner: ${owner}`;
  wrapper.append(pOwner);

  const pStars = document.createElement('p');
  pStars.textContent = `Stars: ${stars}`;
  wrapper.append(pStars);

  const remove = document.createElement('img');
  remove.src = './remove.svg';

  chart.appendChild(wrapper);
  remove.addEventListener('click', () => {
    chart.removeChild(wrapper);
  });
  wrapper.appendChild(remove);

  search.value = null;
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
