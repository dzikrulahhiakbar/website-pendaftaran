const form = document.getElementById("formPendaftaran");
const nama = document.getElementById("nama");
const jurusan = document.getElementById("jurusan");
const hasil = document.getElementById("hasil");
const searchNama = document.getElementById("searchNama");
const filterJurusan = document.getElementById("filterJurusan");
const emptyState = document.getElementById("emptyState");
const themeToggle = document.getElementById("themeToggle");

const errorNama = document.getElementById("errorNama");
const errorJK = document.getElementById("errorJK");
const errorHobi = document.getElementById("errorHobi");
const errorJurusan = document.getElementById("errorJurusan");

const tbody = document.querySelector("#tabelData tbody");

// ========================
// AMBIL DATA DARI STORAGE
// ========================
let dataPendaftar =
    JSON.parse(localStorage.getItem("pendaftaran")) || [];

let indexEdit = null;

// ========================
// TAMPILKAN KE TABEL
// ========================
function renderTabel() {
    tbody.innerHTML = "";

    const keywoard = searchNama.value.toLowerCase();
    const jurusanFilter = filterJurusan.value;

    let tampil = 0;

    dataPendaftar.forEach((data, index) => {

        if (!data.nama.toLowerCase().includes(keywoard)) return;

        if (jurusanFilter !== "" && data.jurusan !== jurusanFilter) return;

        tampil++;

        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${data.nama}</td>
                <td>${data.jk}</td>
                <td>${data.hobi.join(", ")}</td>
                <td>${data.jurusan}</td>
                <td>
                    <button class="btn btn-edit" onclick="editData(${index})">
                        Edit
                    </button>
                    <button class="btn btn-hapus" onclick="hapusData(${index})">
                        Hapus
                    </button>
                </td>
            </tr>
        `;
    });

    emptyState.style.display = tampil === 0 ? "block" : "none";
}

// ========================
// HAPUS DATA
// ========================
function hapusData(index) {
    const yakin = confirm("Yakin mau hapus data ini?");
    if (!yakin) return;

    dataPendaftar.splice(index, 1);
    localStorage.setItem(
        "pendaftaran",
        JSON.stringify(dataPendaftar)
    );
    renderTabel();
}

// ========================
// SUBMIT FORM
// ========================
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const jk = document.querySelector(
        'input[name="jk"]:checked'
    );

    const checkboxes = document.querySelectorAll(
        'input[type="checkbox"]:checked'
    );

    if (!jk || checkboxes.length === 0 || jurusan.value === "") {
        alert("Lengkapi semua data!");
        return;
    }

    let hobi = [];
    checkboxes.forEach(cb => hobi.push(cb.value));

    const dataBaru = {
        nama: nama.value,
        jk: jk.value,
        hobi: hobi,
        jurusan: jurusan.value
    };

    if (indexEdit === null) {
        dataPendaftar.push(dataBaru);
    } else {
        dataPendaftar[indexEdit] = dataBaru;
        indexEdit = null;
    }

    localStorage.setItem(
        "pendaftaran",
        JSON.stringify(dataPendaftar)
    );

    renderTabel();

    nama.focus();
    form.reset();
});

// tampilkan saat reload
renderTabel();

function editData(index) {
    const data = dataPendaftar[index];

    nama.value = data.nama;
    jurusan.value = data.jurusan;

    document
        .querySelector(`input[name="jk"][value="${data.jk}"]`)
        .checked = true;

    document
        .querySelectorAll('input[type="checkbox"]')
        .forEach(cb => {
            cb.checked = data.hobi.includes(cb.value);
        });
    
    indexEdit = index;
}

searchNama.addEventListener("input", function () {
    renderTabel();
})

filterJurusan.addEventListener("change", function () {
    renderTabel();
})

// Dark Mode
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "Light Mode";
}

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "Dark Mode"; 
    }
})