async function run(mode) {
    if (mode === "load") {
        let installedData = await eel.pip_list()();
        for (let i = 0; i < installedData.length; i++) {
            installedData[i] = JSON.parse(installedData[i]);
        }
        let installed = installedData.map(pkg => pkg.name);
        let packages = [];
        return [installed, packages, installedData];
    } else if (mode === "update") {
        let installedData = await eel.pip_list()();
        for (let i = 0; i < installedData.length; i++) {
            installedData[i] = JSON.parse(installedData[i]);
        }
        let installed = installedData.map(pkg => pkg.name);
        return [installed, installedData];
    }
}

let installed, packages, installedData

var sQuery = "", lastSearch, maxSearch;

async function main() {
    [installed, packages, installedData] = await run("load");

    await get(query="", def=true);

    async function getInfo(query, installed) {
        if (!window.navigator.onLine) {
            return JSON.parse(await eel.pip_show(query)());
        } else {
            return JSON.parse(await eel.getInfo(query)());
        }
    }

    let search = document.getElementById("search");
    search.addEventListener("keydown", async (event) => {
        sQuery = search.value;
        if (event.key == "Enter") {await get(search.value);}
    });
    let wrapper = document.getElementById("wrapper");
    wrapper.addEventListener("scroll" , async (event) => {
        if (wrapper.scrollTop / (wrapper.scrollHeight - wrapper.clientHeight) > 0.9 && wrapper.scrollHeight > wrapper.clientHeight && lastSearch < maxSearch) {console.log("a");await getMore(sQuery);}
    });

    document.addEventListener("click", async (event) => {
        if (event.target.nodeName !== "BUTTON") return;
        let id = event.target.id;
        if (id.startsWith("pkgitm-")) {
            let pkg = id.slice(7);
            info = await getInfo(pkg, installed.includes(pkg));
            let infoDiv = document.getElementById("info");
            infoDiv.innerHTML = `<div class="overflow-auto flex"><div class="float-left flex-1"><h1 class="text-4xl font-bold">${info.name}</h1><p>${info.summary}</p></div><div class="float-right flex-0"><p>Latest Version: ${info.version}${installed.includes(info.name) ? ` | Installed: ${installedData.filter(d => d.name == info.name)[0].version}` : ""}</p><div class="flex flex-row gap-2">${installed.includes(info.name) ? `${installedData.filter(d => d.name == info.name)[0].version !== info.version ? `<button class="updater-${info.name} font-normal bg-gray-600 hover:bg-gray-500 p-1 rounded-md flex-grow">Update</button>` : ""}<button class="installer-${info.name} font-normal bg-gray-600 hover:bg-gray-500 p-1 rounded-md flex-grow">Uninstall</button>` : `<button class="installer-${info.name} font-normal bg-gray-600 hover:bg-gray-500 p-1 rounded-md flex-grow">Install</button>`}</div></div></div><hr><h3 class="text-xl font-semibold">Description</h3><md-block>${info.description}</md-block><br><p>Author: ${info.author}</p><p>License: ${info.license}</p><p>Home Page: <a href="${info.home_page}">${info.home_page}</a></p><p>Requires: ${info.requires_dist === null ? "No dependencies" : info.requires_dist?.join(', ')}</p>`;
            return;
        }
        let cls = event.target.className.split(" ")[0];
        if (cls.startsWith("installer")) {
            let pkg = cls.slice(10);
            let curr = document.getElementsByClassName(`installer-${pkg}`);
            if (!installed.includes(pkg)) {
                for (let i = 0; i < curr.length; i++) {
                    curr[i].innerText = "Installing..."
                    curr[i].disabled = true;
                }
                res = await eel.pip_install(pkg)()
                if (res === 0) {
                    for (let i = 0; i < curr.length; i++) {
                        curr[i].innerText = "Uninstall";
                        curr[i].disabled = false;
                    }
                } else {
                    for (let i = 0; i < curr.length; i++) {
                        curr[i].innerText = "Error!";
                        curr[i].disabled = false;
                        await delay(5000)
                        curr[i].innerText = "Install";
                    }
                }
            } else {
                for (let i = 0; i < curr.length; i++) {
                    curr[i].innerText = "Uninstalling..."
                    curr[i].disabled = true;
                }
                res = await eel.pip_remove(pkg)();
                if (res === 0) {
                    for (let i = 0; i < curr.length; i++) {
                        curr[i].innerText = "Install";
                        curr[i].disabled = false;
                    }
                } else {
                    for (let i = 0; i < curr.length; i++) {
                        curr[i].innerText = "Error!";
                        curr[i].disabled = false;
                        await delay(5000)
                        curr[i].innerText = "Uninstall";
                    }
                }
            }
            [installed, installedData] = await run("update");
            await get(sQuery);
        } else if (cls.startsWith("updater-")) {
            let pkg = cls.slice(8);
            let curr = document.getElementsByClassName(`updater-${pkg}`);
            for (let i = 0; i < curr.length; i++) {
                curr[i].innerText = "Updating..."
                curr[i].disabled = true;
            }
            res = await eel.pip_upgrade(pkg)();
            if (res === 0) {
                for (let i = 0; i < curr.length; i++) {
                    curr[i].remove()
                }
            } else {
                for (let i = 0; i < curr.length; i++) {
                    curr[i].innerText = "Error!";
                    curr[i].disabled = false;
                    await delay(5000)
                    curr[i].innerText = "Update";
                }
            }
            [installed, installedData] = await run("update");
            await get(sQuery);
            info = await getInfo(pkg, installed.includes(pkg));
            let infoDiv = document.getElementById("info");
            infoDiv.innerHTML = `<div class="overflow-auto"><div class="float-left"><h1 class="text-4xl font-bold">${info.name}</h1><p>${info.summary}</p></div><div class="float-right"><p>Latest Version: ${info.version}${installed.includes(info.name) ? ` | Installed: ${installedData.filter(d => d.name == info.name)[0].version}` : ""}</p><div class="flex flex-row gap-2">${installed.includes(info.name) ? `${installedData.filter(d => d.name == info.name)[0].version !== info.version ? `<button class="updater-${info.name} font-normal bg-gray-600 hover:bg-gray-500 p-1 rounded-md flex-grow">Update</button>` : ""}<button class="installer-${info.name} font-normal bg-gray-600 hover:bg-gray-500 p-1 rounded-md flex-grow">Uninstall</button>` : `<button class="installer-${info.name} font-normal bg-gray-600 hover:bg-gray-500 p-1 rounded-md flex-grow">Install</button>`}</div></div></div><hr><h3 class="text-xl font-semibold">Description</h3><md-block>${info.description}</md-block><br><p>Author: ${info.author}</p><p>License: ${info.license}</p><p>Home Page: <a href="${info.home_page}">${info.home_page}</a></p><p>Requires: ${info.requires_dist === null ? "No dependencies" : info.requires_dist?.join(', ')}</p>`;
        }
    });
}

async function generateResult(db, filter=[], query="", all=false, start=0) {
    if (query.trim().length === 0 && all == false) return [db.slice(0, 30), 0, 0];
    if (query.trim().length === 0 && all == true) return [db, 0, 0];
    async function search(db, query) {
        let result = await eel.search(db, filter, query, all, start)();
        return result;
    }
    return await search(db, query);
}

async function get(query=0, def=false) {
    if (query.trim().length === 0) {def = true;}

    let infoDiv = document.getElementById("info");

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

    let installedRes = await generateResult(installed, [], query, all=true, 0);
    installedRes = installedRes[0]
    installedDiv.innerHTML = installedRes.map(pkg => `<button id="pkgitm-${pkg}" class="w-full p-1 font-medium rounded-lg hover:bg-gray-700 focus:text-sky-400 focus:bg-gray-900 active:ring">${pkg}<br><button class="installer-${pkg} font-normal bg-gray-600 hover:bg-gray-500 rounded-md w-20">Uninstall</button></button>`).join('');

    let recommendedRes = [];
    if (!def) {
        recommendedRes = await generateResult([], installed, query, all=false, 0);
        lastSearch = recommendedRes[1];
        maxSearch = recommendedRes[2];
        recommendedRes = recommendedRes[0];
    }
    recommendedDiv.innerHTML = recommendedRes.map(pkg => `<button id="pkgitm-${pkg}" class="w-full p-1 font-medium rounded-lg hover:bg-gray-700 focus:text-sky-400 focus:bg-gray-900 active:ring">${pkg}<br><button class="installer-${pkg} font-normal bg-gray-600 hover:bg-gray-500 rounded-md w-20">Install</button></button>`).join('');
}
async function getMore(query=0) {
    let recommendedDiv = document.getElementById("recommended");
    let recommendedRes = [];
    recommendedRes = await generateResult([], installed, query, all=false, lastSearch);
    lastSearch = recommendedRes[1];
    maxSearch = recommendedRes[2];
    recommendedRes = recommendedRes[0];
    recommendedDiv.innerHTML += recommendedRes.map(pkg => `<button id="pkgitm-${pkg}" class="w-full p-1 font-medium rounded-lg hover:bg-gray-700 focus:text-sky-400 focus:bg-gray-900 active:ring">${pkg}<br><button class="installer-${pkg} font-normal bg-gray-600 hover:bg-gray-500 rounded-md w-20">Install</button></button>`).join('');
}

window.onload = main;
