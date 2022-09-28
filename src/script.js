const search = document.getElementById('search');
const matchList = document.getElementById('match-list');

const searchStates = async (searchText) => {
  url3 = `https://api.github.com/search/repositories?q=${searchText}`;
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
};

const outputHtml = (matches) => {
  if (matches.length > 0) {
    const html = matches
      .map(
        (match) => `
        <div class="card card-body mb-1">
        <h4>${match.name}(${match.owner.login}) <span class="text-primary">${match.stargazers_count}</span></h4>
        <small>Lat: ${match.stargazers_count} / Long: ${match.stargazers_count}</small>
        </div>
        `
      )
      .join('');

    matchList.innerHTML = html;
  }
};

search.addEventListener('input', () => searchStates(search.value));
