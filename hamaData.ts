// Definisikan tipe data
export interface HamaData {
  hama: string;
  obat: string[];
  kategori: string;
}

// Data hama
export const hamaData: HamaData[] = [
  {
    hama: "penggerek_batang_padi_asia",
    obat: ["Furadan", "Dursban", "Confidor"],
    kategori: "Hama Penggerek Batang"
  },
  {
    hama: "penggerek_batang_padi_kuning",
    obat: ["Furadan", "Dursban", "Confidor"],
    kategori: "Hama Penggerek Batang"
  },
  {
    hama: "belatung_batang_padi",
    obat: ["Furadan", "Dursban", "Confidor"],
    kategori: "Hama Penggerek Batang"
  },
  {
    hama: "lalat_batang_padi",
    obat: ["Furadan", "Dursban", "Marshal"],
    kategori: "Hama Penggerek Batang"
  },
  {
    hama: "ulat_daun_padi",
    obat: ["Decis", "Prevathon", "Neem Oil"],
    kategori: "Hama Perusak Daun"
  },
  {
    hama: "penggulung_daun_padi",
    obat: ["Decis", "Prevathon", "Neem Oil"],
    kategori: "Hama Perusak Daun"
  },
  {
    hama: "wereng_daun_padi",
    obat: ["Bassa", "Applaud", "Neem Oil"],
    kategori: "Hama Perusak Daun"
  },
  {
    hama: "kumbang_air_padi",
    obat: ["Furadan", "Dursban", "Fipronil"],
    kategori: "Hama Perusak Akar dan Biji"
  },
  {
    hama: "hama_kulit_padi",
    obat: ["Furadan", "Dursban", "Diazinon"],
    kategori: "Hama Perusak Akar dan Biji"
  },
  {
    hama: "lalat_pucuk_padi",
    obat: ["Dursban", "Neem Oil"],
    kategori: "Hama pada Pucuk atau Tunas"
  },
  {
    hama: "wereng_batang_coklat",
    obat: ["Bassa", "Applaud", "Neem Oil"],
    kategori: "Hama Umum"
  },
  {
    hama: "thrips",
    obat: ["Bassa", "Applaud", "Neem Oil"],
    kategori: "Hama Umum"
  }
];
