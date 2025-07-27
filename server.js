const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const path = require("path");

// 初代ポケモン（1-151）の日本語名→英語名変換テーブル
const pokemonNameMap = {
  // 第1世代 (1-151)
  フシギダネ: "bulbasaur",
  フシギソウ: "ivysaur",
  フシギバナ: "venusaur",
  ヒトカゲ: "charmander",
  リザード: "charmeleon",
  リザードン: "charizard",
  ゼニガメ: "squirtle",
  カメール: "wartortle",
  カメックス: "blastoise",
  キャタピー: "caterpie",
  トランセル: "metapod",
  バタフリー: "butterfree",
  ビードル: "weedle",
  コクーン: "kakuna",
  スピアー: "beedrill",
  ポッポ: "pidgey",
  ピジョン: "pidgeotto",
  ピジョット: "pidgeot",
  コラッタ: "rattata",
  ラッタ: "raticate",
  オニスズメ: "spearow",
  オニドリル: "fearow",
  アーボ: "ekans",
  アーボック: "arbok",
  ピカチュウ: "pikachu",
  ライチュウ: "raichu",
  サンド: "sandshrew",
  サンドパン: "sandslash",
  "ニドラン♀": "nidoran-f",
  ニドリーナ: "nidorina",
  ニドクイン: "nidoqueen",
  "ニドラン♂": "nidoran-m",
  ニドリーノ: "nidorino",
  ニドキング: "nidoking",
  ピッピ: "clefairy",
  ピクシー: "clefable",
  ロコン: "vulpix",
  キュウコン: "ninetales",
  プリン: "jigglypuff",
  プクリン: "wigglytuff",
  ズバット: "zubat",
  ゴルバット: "golbat",
  ナゾノクサ: "oddish",
  クサイハナ: "gloom",
  ラフレシア: "vileplume",
  パラス: "paras",
  パラセクト: "parasect",
  コンパン: "venonat",
  モルフォン: "venomoth",
  ディグダ: "diglett",
  ダグトリオ: "dugtrio",
  ニャース: "meowth",
  ペルシアン: "persian",
  コダック: "psyduck",
  ゴルダック: "golduck",
  マンキー: "mankey",
  オコリザル: "primeape",
  ガーディ: "growlithe",
  ウインディ: "arcanine",
  ニョロモ: "poliwag",
  ニョロゾ: "poliwhirl",
  ニョロボン: "poliwrath",
  ケーシィ: "abra",
  ユンゲラー: "kadabra",
  フーディン: "alakazam",
  ワンリキー: "machop",
  ゴーリキー: "machoke",
  カイリキー: "machamp",
  マダツボミ: "bellsprout",
  ウツドン: "weepinbell",
  ウツボット: "victreebel",
  メノクラゲ: "tentacool",
  ドククラゲ: "tentacruel",
  イシツブテ: "geodude",
  ゴローン: "graveler",
  ゴローニャ: "golem",
  ポニータ: "ponyta",
  ギャロップ: "rapidash",
  ヤドン: "slowpoke",
  ヤドラン: "slowbro",
  コイル: "magnemite",
  レアコイル: "magneton",
  カモネギ: "farfetchd",
  ドードー: "doduo",
  ドードリオ: "dodrio",
  パウワウ: "seel",
  ジュゴン: "dewgong",
  ベトベター: "grimer",
  ベトベトン: "muk",
  シェルダー: "shellder",
  パルシェン: "cloyster",
  ゴース: "gastly",
  ゴースト: "haunter",
  ゲンガー: "gengar",
  イワーク: "onix",
  スリープ: "drowzee",
  スリーパー: "hypno",
  クラブ: "krabby",
  キングラー: "kingler",
  ビリリダマ: "voltorb",
  マルマイン: "electrode",
  タマタマ: "exeggcute",
  ナッシー: "exeggutor",
  カラカラ: "cubone",
  ガラガラ: "marowak",
  サワムラー: "hitmonlee",
  エビワラー: "hitmonchan",
  ベロリンガ: "lickitung",
  ドガース: "koffing",
  マタドガス: "weezing",
  サイホーン: "rhyhorn",
  サイドン: "rhydon",
  ラッキー: "chansey",
  モンジャラ: "tangela",
  ガルーラ: "kangaskhan",
  タッツー: "horsea",
  シードラ: "seadra",
  トサキント: "goldeen",
  アズマオウ: "seaking",
  ヒトデマン: "staryu",
  スターミー: "starmie",
  バリヤード: "mr-mime",
  ストライク: "scyther",
  ルージュラ: "jynx",
  エレブー: "electabuzz",
  ブーバー: "magmar",
  カイロス: "pinsir",
  ケンタロス: "tauros",
  コイキング: "magikarp",
  ギャラドス: "gyarados",
  ラプラス: "lapras",
  メタモン: "ditto",
  イーブイ: "eevee",
  シャワーズ: "vaporeon",
  サンダース: "jolteon",
  ブースター: "flareon",
  ポリゴン: "porygon",
  オムナイト: "omanyte",
  オムスター: "omastar",
  カブト: "kabuto",
  カブトプス: "kabutops",
  プテラ: "aerodactyl",
  カビゴン: "snorlax",
  フリーザー: "articuno",
  サンダー: "zapdos",
  ファイヤー: "moltres",
  ミニリュウ: "dratini",
  ハクリュー: "dragonair",
  カイリュー: "dragonite",
  ミュウツー: "mewtwo",
  ミュウ: "mew",
};

// 英語名から日本語名への逆引きマップも作成
const englishToJapaneseMap = Object.fromEntries(
  Object.entries(pokemonNameMap).map(([jp, en]) => [en, jp])
);

// 日本語名を英語名に変換（部分一致も含む）
function convertJapaneseToEnglish(query) {
  const exactMatch = pokemonNameMap[query];
  if (exactMatch) return [exactMatch];

  // 部分一致検索
  const partialMatches = [];
  for (const [japanese, english] of Object.entries(pokemonNameMap)) {
    if (japanese.includes(query)) {
      partialMatches.push(english);
    }
  }

  return partialMatches;
}

// 英語名での検索も可能にする
function searchPokemonNames(query) {
  const lowercaseQuery = query.toLowerCase();
  const results = [];

  // 日本語名からの変換を試行
  const japaneseResults = convertJapaneseToEnglish(query);
  results.push(...japaneseResults);

  // 英語名での直接検索
  for (const [japanese, english] of Object.entries(pokemonNameMap)) {
    if (english.includes(lowercaseQuery) && !results.includes(english)) {
      results.push(english);
    }
  }

  return results;
}

// PokeAPI からデータを取得するヘルパー関数
function fetchFromPokeAPI(path) {
  return new Promise((resolve, reject) => {
    https
      .get(`https://pokeapi.co/api/v2${path}`, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

// ポケモンの日本語名を取得（キャッシュ優先）
function getPokemonJapaneseName(pokemonData) {
  // まずキャッシュから取得を試行
  const cachedName = englishToJapaneseMap[pokemonData.name];
  if (cachedName) {
    return Promise.resolve(cachedName);
  }

  // キャッシュにない場合はAPIから取得
  return fetchFromPokeAPI(`/pokemon-species/${pokemonData.id}`)
    .then((speciesData) => {
      const japaneseName = speciesData.names.find(
        (name) => name.language.name === "ja"
      );
      return japaneseName ? japaneseName.name : pokemonData.name;
    })
    .catch(() => pokemonData.name);
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // リクエストログ
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (parsedUrl.pathname === "/api/pokemon") {
    try {
      const page = parseInt(parsedUrl.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      // 初代ポケモンは1-151番
      if (offset >= 151) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          '<div class="text-center p-4">全てのポケモンを表示しました</div>'
        );
        return;
      }

      const maxLimit = Math.min(limit, 151 - offset);
      const pokemonList = await fetchFromPokeAPI(
        `/pokemon?limit=${maxLimit}&offset=${offset}`
      );

      let pokemonCards = "";
      for (const pokemon of pokemonList.results) {
        const pokemonData = await fetchFromPokeAPI(`/pokemon/${pokemon.name}`);
        const japaneseName = await getPokemonJapaneseName(pokemonData);

        pokemonCards += `
          <div class="card bg-base-100 shadow-lg border-2 border-base-300 cursor-pointer hover:shadow-2xl hover:border-primary hover:scale-105 transition-all duration-300"
               hx-get="/api/pokemon/${pokemonData.id}" 
               hx-target="#pokemon-detail" 
               hx-swap="innerHTML">
            <figure class="px-4 pt-4">
              <img src="${pokemonData.sprites.front_default}" 
                   alt="${japaneseName}" 
                   class="rounded-xl w-24 h-24 object-contain bg-gray-50 p-2" />
            </figure>
            <div class="card-body p-4 text-center">
              <h3 class="card-title text-sm justify-center text-gray-500">
                #${pokemonData.id.toString().padStart(3, "0")}
              </h3>
              <p class="text-lg font-bold text-primary">${japaneseName}</p>
              <div class="flex flex-wrap gap-1 justify-center">
                ${pokemonData.types
                  .map((type) => {
                    const typeColors = {
                      normal: "badge-neutral",
                      fire: "badge-error",
                      water: "badge-info",
                      electric: "badge-warning",
                      grass: "badge-success",
                      ice: "badge-accent",
                      fighting: "badge-error",
                      poison: "badge-secondary",
                      ground: "badge-warning",
                      flying: "badge-info",
                      psychic: "badge-secondary",
                      bug: "badge-success",
                      rock: "badge-neutral",
                      ghost: "badge-secondary",
                      dragon: "badge-primary",
                      dark: "badge-neutral",
                      steel: "badge-neutral",
                      fairy: "badge-accent",
                    };
                    return `<span class="badge ${
                      typeColors[type.type.name] || "badge-neutral"
                    } badge-sm">${type.type.name}</span>`;
                  })
                  .join("")}
              </div>
            </div>
          </div>
        `;
      }

      const hasMore = offset + maxLimit < 151;
      const nextButton = hasMore
        ? `
        <button class="btn btn-primary btn-block" 
                hx-get="/api/pokemon?page=${page + 1}" 
                hx-target="#pokemon-grid" 
                hx-swap="beforeend">
          もっと見る
        </button>
      `
        : "";

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(pokemonCards + (page === 1 ? nextButton : ""));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end('<div class="alert alert-error">エラーが発生しました</div>');
    }
  } else if (parsedUrl.pathname.startsWith("/api/pokemon/")) {
    try {
      const pokemonId = parsedUrl.pathname.split("/")[3];
      const pokemonData = await fetchFromPokeAPI(`/pokemon/${pokemonId}`);
      const japaneseName = await getPokemonJapaneseName(pokemonData);
      const speciesData = await fetchFromPokeAPI(
        `/pokemon-species/${pokemonId}`
      );

      // 日本語の説明文を取得
      const flavorText =
        speciesData.flavor_text_entries
          .find((entry) => entry.language.name === "ja")
          ?.flavor_text.replace(/\n/g, " ") || "No description available";

      const detailHtml = `
        <div class="card bg-base-100 shadow-2xl border-2 border-primary">
          <div class="card-body p-6">
            <div class="flex flex-col lg:flex-row gap-8">
              <!-- ポケモン画像・基本情報 -->
              <div class="flex-shrink-0 text-center lg:w-1/4">
                <div class="bg-gradient-to-br from-base-200 to-base-300 rounded-xl p-6 mb-4">
                  <img src="${pokemonData.sprites.front_default}" 
                       alt="${japaneseName}" 
                       class="w-64 h-64 object-contain mx-auto drop-shadow-lg" />
                </div>
                <h2 class="text-3xl font-bold text-primary mb-2">
                  ${japaneseName}
                </h2>
                <p class="text-lg text-gray-500 mb-4">
                  #${pokemonData.id.toString().padStart(3, "0")}
                </p>
                <div class="flex flex-wrap gap-2 justify-center">
                  ${pokemonData.types
                    .map((type) => {
                      const typeColors = {
                        normal: "badge-neutral",
                        fire: "badge-error",
                        water: "badge-info",
                        electric: "badge-warning",
                        grass: "badge-success",
                        ice: "badge-accent",
                        fighting: "badge-error",
                        poison: "badge-secondary",
                        ground: "badge-warning",
                        flying: "badge-info",
                        psychic: "badge-secondary",
                        bug: "badge-success",
                        rock: "badge-neutral",
                        ghost: "badge-secondary",
                        dragon: "badge-primary",
                        dark: "badge-neutral",
                        steel: "badge-neutral",
                        fairy: "badge-accent",
                      };
                      return `<span class="badge ${
                        typeColors[type.type.name] || "badge-neutral"
                      } badge-lg">${type.type.name}</span>`;
                    })
                    .join("")}
                </div>
              </div>
              
              <!-- 詳細情報 -->
              <div class="flex-1 lg:w-3/4">
                <!-- 説明文 -->
                <div class="mb-6">
                  <h3 class="text-xl font-bold text-primary mb-3 border-b-2 border-primary pb-1">📖 説明</h3>
                  <p class="text-base leading-relaxed bg-base-200 p-4 rounded-lg">${flavorText}</p>
                </div>
                
                <!-- 基本情報 -->
                <div class="mb-6">
                  <h3 class="text-xl font-bold text-primary mb-3 border-b-2 border-primary pb-1">📊 基本情報</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="stat bg-base-200 rounded-lg">
                      <div class="stat-title">身長</div>
                      <div class="stat-value text-2xl text-info">${
                        pokemonData.height / 10
                      }m</div>
                    </div>
                    <div class="stat bg-base-200 rounded-lg">
                      <div class="stat-title">体重</div>
                      <div class="stat-value text-2xl text-warning">${
                        pokemonData.weight / 10
                      }kg</div>
                    </div>
                    <div class="stat bg-base-200 rounded-lg">
                      <div class="stat-title">経験値</div>
                      <div class="stat-value text-2xl text-success">${
                        pokemonData.base_experience
                      }</div>
                    </div>
                  </div>
                </div>
                
                <!-- ステータス -->
                <div>
                  <h3 class="text-xl font-bold text-primary mb-3 border-b-2 border-primary pb-1">⚔️ ステータス</h3>
                  <div class="overflow-x-auto">
                    <table class="table table-zebra w-full" style="table-layout: fixed;">
                      <tbody>
                        ${pokemonData.stats
                          .map((stat) => {
                            const statNames = {
                              hp: "HP",
                              attack: "攻撃",
                              defense: "防御",
                              "special-attack": "特攻",
                              "special-defense": "特防",
                              speed: "素早さ",
                            };
                            return `
                            <tr>
                              <td class="font-semibold text-right pr-4 whitespace-nowrap" style="min-width: 80px; width: 80px;">${
                                statNames[stat.stat.name] || stat.stat.name
                              }</td>
                              <td class="w-full">
                                <progress class="progress progress-primary w-full" value="${
                                  stat.base_stat
                                }" max="255"></progress>
                              </td>
                              <td class="text-right pl-4 whitespace-nowrap" style="min-width: 60px; width: 60px;">
                                <span class="font-bold text-sm">${
                                  stat.base_stat
                                }</span>
                              </td>
                            </tr>`;
                          })
                          .join("")}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card-actions justify-end mt-6">
              <button class="btn btn-secondary" @click="$store.pokedex.clearDetail()">
                閉じる
              </button>
            </div>
          </div>
        </div>
      `;

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(detailHtml);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end(
        '<div class="alert alert-error">ポケモンの詳細を取得できませんでした</div>'
      );
    }
  } else if (parsedUrl.pathname === "/api/search") {
    try {
      const query = decodeURIComponent(parsedUrl.query.q || "");
      if (!query) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("");
        return;
      }

      console.log(`Search query: "${query}"`);

      // 日本語名・英語名両方から検索対象のポケモン名リストを取得
      const searchTargets = searchPokemonNames(query);
      console.log(`Search targets: ${JSON.stringify(searchTargets)}`);

      let searchResults = "";
      const foundPokemon = new Set(); // 重複を避けるため

      for (const englishName of searchTargets) {
        try {
          console.log(`Fetching Pokemon: ${englishName}`);
          const pokemonData = await fetchFromPokeAPI(`/pokemon/${englishName}`);
          console.log(
            `Found Pokemon: ${pokemonData.name} (ID: ${pokemonData.id})`
          );

          if (pokemonData.id <= 151 && !foundPokemon.has(pokemonData.id)) {
            foundPokemon.add(pokemonData.id);
            const japaneseName =
              englishToJapaneseMap[englishName] || pokemonData.name;

            searchResults += `
              <div class="card card-side bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow mb-4"
                   hx-get="/api/pokemon/${pokemonData.id}" 
                   hx-target="#pokemon-detail" 
                   hx-swap="innerHTML">
                <figure class="w-24">
                  <img src="${pokemonData.sprites.front_default}" 
                       alt="${japaneseName}" 
                       class="w-20 h-20 object-contain" />
                </figure>
                <div class="card-body p-4">
                  <h3 class="card-title text-lg">
                    #${pokemonData.id
                      .toString()
                      .padStart(3, "0")} ${japaneseName}
                  </h3>
                  <div class="flex flex-wrap gap-1">
                    ${pokemonData.types
                      .map((type) => {
                        const typeColors = {
                          normal: "badge-neutral",
                          fire: "badge-error",
                          water: "badge-info",
                          electric: "badge-warning",
                          grass: "badge-success",
                          ice: "badge-accent",
                          fighting: "badge-error",
                          poison: "badge-secondary",
                          ground: "badge-warning",
                          flying: "badge-info",
                          psychic: "badge-secondary",
                          bug: "badge-success",
                          rock: "badge-neutral",
                          ghost: "badge-secondary",
                          dragon: "badge-primary",
                          dark: "badge-neutral",
                          steel: "badge-neutral",
                          fairy: "badge-accent",
                        };
                        return `<span class="badge ${
                          typeColors[type.type.name] || "badge-neutral"
                        } badge-sm">${type.type.name}</span>`;
                      })
                      .join("")}
                  </div>
                </div>
              </div>
            `;
          }
        } catch (error) {
          // 個別のポケモンでエラーが発生した場合はスキップ
          console.log(`Error fetching Pokemon ${englishName}:`, error.message);
          continue;
        }
      }

      if (!searchResults) {
        searchResults =
          '<div class="text-center p-4 text-gray-500">該当するポケモンが見つかりませんでした<br><small>ひらがな・カタカナ・英語名で検索してください</small></div>';
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(searchResults);
    } catch (error) {
      console.log("Search API error:", error);
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end(
        '<div class="alert alert-error">検索中にエラーが発生しました</div>'
      );
    }
  } else if (parsedUrl.pathname === "/api/test") {
    // デバッグ用エンドポイント
    const query = decodeURIComponent(parsedUrl.query.q || "");
    const japaneseResults = convertJapaneseToEnglish(query);
    const searchResults = searchPokemonNames(query);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        query: query,
        japaneseResults: japaneseResults,
        searchResults: searchResults,
        hasMapping: !!pokemonNameMap[query],
      })
    );
  } else if (parsedUrl.pathname === "/api/hello") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
            <div class="text-green-600 font-semibold">
                Hello from HTMX! Time: ${new Date().toLocaleTimeString()}
            </div>
        `);
  } else {
    // 静的ファイル配信
    let filePath = parsedUrl.pathname;
    if (filePath === "/") {
      filePath = "/pokedex.html";
    }

    const fullPath = path.join(__dirname, filePath);
    console.log(`Static file request: ${filePath} -> ${fullPath}`);

    const extname = String(path.extname(fullPath)).toLowerCase();
    const mimeTypes = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".wav": "audio/wav",
      ".mp4": "video/mp4",
      ".woff": "application/font-woff",
      ".ttf": "application/font-ttf",
      ".eot": "application/vnd.ms-fontobject",
      ".otf": "application/font-otf",
      ".wasm": "application/wasm",
    };

    const contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(fullPath, (error, content) => {
      if (error) {
        if (error.code === "ENOENT") {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("File Not Found");
        } else {
          res.writeHead(500);
          res.end("Server Error: " + error.code);
        }
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    });
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});
