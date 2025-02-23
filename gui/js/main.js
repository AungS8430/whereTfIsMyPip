async function run() {
    let installedData = await eel.pip_list()();
    for (let i = 0; i < installedData.length; i++) {
        installedData[i] = JSON.parse(installedData[i]);
    }
    let installed = installedData.map(pkg => pkg.name);
    let packages = await eel.get()()
    return [installed, packages, installedData];
}

let installed, packages, installedData

async function main() {
    [installed, packages, installedData] = await run();

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
            return result;
        }
        return await search(db, query);
    }
    async function getInfo(query, installed) {
        if (!window.navigator.onLine) {
            return JSON.parse(await eel.pip_show(query)());
        } else {
            return JSON.parse(await eel.getInfo(query)());
        }
    }
    if (query.trim().length === 0) {def = true;}

    let wrapper = document.getElementById("wrapper");
    let infoDiv = document.getElementById("info");
    wrapper.addEventListener("click", async (event) => {
        if (event.target.nodeName !== "BUTTON") return;
        let id = event.target.id;
        if (id.startsWith("pkgitm-")) {
            let pkg = id.slice(7);
            info = await getInfo(pkg, installed.includes(pkg));
            console.log(info)
            infoDiv.innerHTML = `<div class="overflow-auto"><div class="float-left"><h1 class="text-4xl font-bold">${info.name}</h1><p>${info.summary}</p></div><div class="float-right"><p>Latest Version: ${info.version}${installed.includes(info.name) ? ` | Installed: ${installedData.filter(d => d.name == info.name)[0].version}` : ""}</p><div class="flex flex-row gap-2">${installed.includes(info.name) ? `${installedData.filter(d => d.name == info.name)[0].version !== info.version ? `<button id="updater-${info.name}" class="font-normal bg-gray-600 hover:bg-gray-500 p-1 rounded-md flex-grow">Update</button>` : ""}<button id="installer-${info.name}" class="font-normal bg-gray-600 hover:bg-gray-500 p-1 rounded-md flex-grow">Uninstall</button>` : `<button id="installer-${info.name}" class="font-normal bg-gray-600 hover:bg-gray-500 p-1 rounded-md flex-grow">Install</button>`}</div></div></div><hr><h3 class="text-xl font-semibold">Description</h3><md-block>${info.description}</md-block><br><p>Author: ${info.author}</p><p>License: ${info.license}</p><p>Home Page: <a href="${info.home_page}">${info.home_page}</a></p><p>Requires: ${info.requires_dist === null ? "No dependencies" : info.requires_dist?.join(', ')}</p>`;
        }
    })

    document.addEventListener("click", async (event) => {
        if (event.target.nodeName !== "BUTTON") return;
        let id = event.target.id;
        if (id.startsWith("installer-")) {
            console.log("clicked")
            let pkg = id.slice(10);
            if (!installed.includes(pkg)) {
                console.log(await eel.pip_install(pkg)())
            } else {
                await eel.pip_remove(pkg)();
            }
            await get(query);
        } else if (id.startsWith("updater-")) {
            let pkg = id.slice(8);
            await eel.pip_upgrade(pkg)();
            await get(query);
        }
    })

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
    installedDiv.innerHTML = installedRes.map(pkg => `<button id="pkgitm-${pkg}" class="w-full p-1 font-medium rounded-lg hover:bg-gray-700 focus:text-sky-400 focus:bg-gray-900 active:ring">${pkg}<br><button id="installer-${pkg}" class="font-normal bg-gray-600 hover:bg-gray-500 rounded-md w-20">Uninstall</button></button>`).join('');

    let recommendedRes = [];
    if (!def) {recommendedRes = await generateResult(packages, installed, query);}
    recommendedDiv.innerHTML = recommendedRes.map(pkg => `<button id="pkgitm-${pkg}" class="w-full p-1 font-medium rounded-lg hover:bg-gray-700 focus:text-sky-400 focus:bg-gray-900 active:ring">${pkg}<br><button id="installer-${pkg}" class="font-normal bg-gray-600 hover:bg-gray-500 rounded-md w-20">Install</button></button>`).join('');
}

window.onload = main;