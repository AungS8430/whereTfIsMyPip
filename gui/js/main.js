async function run() {
    let installedData = await eel.pip_list()();
    for (let i = 0; i < installedData.length; i++) {
        installedData[i] = JSON.parse(installedData[i]);
    }
    let installed = installedData.map(pkg => pkg.name);
    let packages = await eel.get()()
    return [installed, packages];
}

let installed, packages

async function main() {
    [installed, packages] = await run();

    await get(query="", def=true);

    let search = document.getElementById("search");
    search.addEventListener("keydown", async (event) => {
        if (event.key == "Enter") {await get(search.value);}
    });
}

async function get(query="", def=false) {
    async function generateResult(db, filter=[], query="") {
        console.log(query.trim().length === 0)
        if (query.trim().length === 0) return db.slice(0, 30);
        async function search(db, query) {
            let result = await eel.search(db, filter, query)();
            console.log(result);
            return result;
        }
        return await search(db, query);
    }
    if (query.trim().length === 0) {def = true;}

    let installedDiv = document.getElementById("installed");
    let recommendedDiv = document.getElementById("recommended");

    let recommendedBtn = document.getElementById("recommendedBtn");

    new IntersectionObserver(async function (entries) {
        if (entries[0].isIntersecting) {
            recommendedBtn.style.bottom = null;
            recommendedBtn.style.top = "5";
        } else {
            recommendedBtn.style.top = null;
            recommendedBtn.style.bottom = "0";
        }
    }).observe(recommendedDiv);

    recommendedDiv.innerHTML = "Loading...";
    installedDiv.innerHTML = "Loading...";

    let installedRes = await generateResult(installed, [], query);
    console.log(installedRes);
    installedDiv.innerHTML = installedRes.map(pkg => `<button id="${pkg}" class="w-full p-1 font-medium rounded-lg hover:bg-gray-700 focus:text-sky-400 focus:bg-gray-900 active:ring">${pkg}<br><button class="font-normal bg-gray-600 hover:bg-gray-500 rounded-md w-20">Uninstall</button></button>`).join('');

    let recommendedRes = [];
    if (!def) {recommendedRes = await generateResult(packages, installed, query);}
    recommendedDiv.innerHTML = recommendedRes.map(pkg => `<button id="${pkg}" class="w-full p-1 font-medium rounded-lg hover:bg-gray-700 focus:text-sky-400 focus:bg-gray-900 active:ring">${pkg}<br><button class="font-normal bg-gray-600 hover:bg-gray-500 rounded-md w-20">Install</button></button>`).join('');
}

window.onload = main;