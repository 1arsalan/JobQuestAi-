const jobsRules = {

  // =========================
  // CSS
  // =========================

  "CSS": {
    category: "CSS",
    minAge: 21,
    maxAge: 30,
    qualification: ["Bachelor"]
  },

  // =========================
  // FIA
  // =========================

  "Assistant Director FIA": {
    category: "FIA",
    minAge: 20,
    maxAge: 30,
    qualification: ["Bachelor", "Master"]
  },

  "Inspector FIA": {
    category: "FIA",
    minAge: 20,
    maxAge: 30,
    qualification: ["Bachelor"]
  },

  "Sub Inspector FIA": {
    category: "FIA",
    minAge: 18,
    maxAge: 30,
    qualification: ["Bachelor"]
  },

  "ASI FIA": {
    category: "FIA",
    minAge: 18,
    maxAge: 30,
    qualification: ["Bachelor"]
  },

  "Constable FIA": {
    category: "FIA",
    minAge: 18,
    maxAge: 25,
    qualification: ["Intermediate"]
  },

  // =========================
  // ASF
  // =========================

  "ASF Inspector": {
    category: "ASF",
    minAge: 18,
    maxAge: 30,
    qualification: ["Bachelor"],
    minHeightMale: 5.6,
    minHeightFemale: 5.2
  },

  "ASF Sub Inspector": {
    category: "ASF",
    minAge: 18,
    maxAge: 30,
    qualification: ["Bachelor"],
    minHeightMale: 5.6,
    minHeightFemale: 5.2
  },

  "ASF ASI": {
    category: "ASF",
    minAge: 18,
    maxAge: 30,
    qualification: ["Bachelor"]
  },

  "ASF Corporal": {
    category: "ASF",
    minAge: 18,
    maxAge: 30,
    qualification: ["Intermediate"]
  },

  // =========================
  // FBR
  // =========================

  "Inspector Inland Revenue": {
    category: "FBR",
    minAge: 20,
    maxAge: 30,
    qualification: ["Bachelor"]
  },

  "Inspector Customs": {
    category: "FBR",
    minAge: 20,
    maxAge: 30,
    qualification: ["Bachelor"]
  },

  "Data Entry Operator": {
    category: "FBR",
    minAge: 18,
    maxAge: 35,
    qualification: ["Intermediate", "Bachelor"],
    computerSkills: true
  },

  "UDC": {
    category: "FBR",
    minAge: 18,
    maxAge: 30,
    qualification: ["Intermediate"]
  },

  "LDC": {
    category: "FBR",
    minAge: 18,
    maxAge: 30,
    qualification: ["Matric"]
  },

  // =========================
  // PUNJAB POLICE
  // =========================

  "Punjab Police Constable": {
    category: "Punjab Police",
    minAge: 18,
    maxAge: 25,
    qualification: ["Intermediate"],
    minHeightMale: 5.7,
    minHeightFemale: 5.2
  },

  "Punjab Police Driver": {
    category: "Punjab Police",
    minAge: 18,
    maxAge: 30,
    qualification: ["Intermediate"],
    drivingLicense: true
  },

  "Punjab Police ASI": {
    category: "Punjab Police",
    minAge: 18,
    maxAge: 28,
    qualification: ["Bachelor"],
    minHeightMale: 5.7,
    minHeightFemale: 5.2
  },

  "Punjab Police Sub Inspector": {
    category: "Punjab Police",
    minAge: 18,
    maxAge: 28,
    qualification: ["Bachelor"],
    minHeightMale: 5.7,
    minHeightFemale: 5.2
  },

  "Punjab Police Clerk": {
    category: "Punjab Police",
    minAge: 18,
    maxAge: 28,
    qualification: ["Intermediate"],
    computerSkills: true
  },

  // =========================
  // ISLAMABAD POLICE
  // =========================

  "Islamabad Police Constable": {
    category: "Islamabad Police",
    minAge: 18,
    maxAge: 25,
    qualification: ["Intermediate"]
  },

  "Islamabad Police ASI": {
    category: "Islamabad Police",
    minAge: 18,
    maxAge: 28,
    qualification: ["Bachelor"]
  },

  "Islamabad Police Sub Inspector": {
    category: "Islamabad Police",
    minAge: 18,
    maxAge: 28,
    qualification: ["Bachelor"]
  },

  // =========================
  // SINDH POLICE
  // =========================

  "Sindh Police Constable": {
    category: "Sindh Police",
    minAge: 18,
    maxAge: 28,
    qualification: ["Intermediate"]
  },

  "Sindh Police ASI": {
    category: "Sindh Police",
    minAge: 18,
    maxAge: 28,
    qualification: ["Bachelor"]
  },

  "Sindh Police Sub Inspector": {
    category: "Sindh Police",
    minAge: 18,
    maxAge: 28,
    qualification: ["Bachelor"]
  }

    ,
// =========================
// KPK POLICE
// =========================

"KPK Police Constable": {
  category: "KPK Police",
  minAge: 18,
  maxAge: 25,
  qualification: ["Intermediate"]
},

"KPK Police ASI": {
  category: "KPK Police",
  minAge: 18,
  maxAge: 28,
  qualification: ["Bachelor"]
},

"KPK Police Sub Inspector": {
  category: "KPK Police",
  minAge: 18,
  maxAge: 28,
  qualification: ["Bachelor"]
},

"KPK Police Clerk": {
  category: "KPK Police",
  minAge: 18,
  maxAge: 30,
  qualification: ["Intermediate"],
  computerSkills: true
},

// =========================
// BALOCHISTAN POLICE
// =========================

"Balochistan Police Constable": {
  category: "Balochistan Police",
  minAge: 18,
  maxAge: 28,
  qualification: ["Intermediate"]
},

"Balochistan Police ASI": {
  category: "Balochistan Police",
  minAge: 18,
  maxAge: 28,
  qualification: ["Bachelor"]
},

"Balochistan Police Sub Inspector": {
  category: "Balochistan Police",
  minAge: 18,
  maxAge: 30,
  qualification: ["Bachelor"]
},

"Balochistan Police Clerk": {
  category: "Balochistan Police",
  minAge: 18,
  maxAge: 30,
  qualification: ["Intermediate"],
  computerSkills: true
},

// =========================
// AJK POLICE
// =========================

"AJK Police Constable": {
  category: "AJK Police",
  minAge: 18,
  maxAge: 25,
  qualification: ["Intermediate"]
},

"AJK Police ASI": {
  category: "AJK Police",
  minAge: 18,
  maxAge: 28,
  qualification: ["Bachelor"]
},

"AJK Police Sub Inspector": {
  category: "AJK Police",
  minAge: 18,
  maxAge: 28,
  qualification: ["Bachelor"]
},

// =========================
// GB POLICE
// =========================

"GB Police Constable": {
  category: "GB Police",
  minAge: 18,
  maxAge: 25,
  qualification: ["Intermediate"]
},

"GB Police ASI": {
  category: "GB Police",
  minAge: 18,
  maxAge: 28,
  qualification: ["Bachelor"]
},

"GB Police Sub Inspector": {
  category: "GB Police",
  minAge: 18,
  maxAge: 28,
  qualification: ["Bachelor"]
},

// =========================
// PPSC
// =========================

"PPSC General": {
  category: "PPSC",
  minAge: 18,
  maxAge: 35,
  qualification: ["Bachelor", "Master"]
},

"Assistant Director PPSC": {
  category: "PPSC",
  minAge: 21,
  maxAge: 35,
  qualification: ["Bachelor", "Master"]
},

"Lecturer PPSC": {
  category: "PPSC",
  minAge: 21,
  maxAge: 35,
  qualification: ["Master"]
},

// =========================
// FPSC
// =========================

"FPSC General": {
  category: "FPSC",
  minAge: 18,
  maxAge: 35,
  qualification: ["Bachelor", "Master"]
},

"Assistant Director FPSC": {
  category: "FPSC",
  minAge: 21,
  maxAge: 35,
  qualification: ["Bachelor", "Master"]
},

"Inspector FPSC": {
  category: "FPSC",
  minAge: 20,
  maxAge: 35,
  qualification: ["Bachelor"]
},

// =========================
// SPSC
// =========================

"SPSC General": {
  category: "SPSC",
  minAge: 18,
  maxAge: 35,
  qualification: ["Bachelor", "Master"]
},

// =========================
// KPPSC
// =========================

"KPPSC General": {
  category: "KPPSC",
  minAge: 18,
  maxAge: 35,
  qualification: ["Bachelor", "Master"]
},

// =========================
// GBPSC
// =========================

"GBPSC General": {
  category: "GBPSC",
  minAge: 18,
  maxAge: 35,
  qualification: ["Bachelor", "Master"]
},

// =========================
// AJKPSC
// =========================

"AJKPSC General": {
  category: "AJKPSC",
  minAge: 18,
  maxAge: 35,
  qualification: ["Bachelor", "Master"]
}
,

// =========================
// PAK ARMY
// =========================

"Army Soldier": {
  category: "Pakistan Army",
  minAge: 17.5,
  maxAge: 23,
  qualification: ["Matric"],
  minHeightMale: 5.6
},

"Army Clerk": {
  category: "Pakistan Army",
  minAge: 17.5,
  maxAge: 23,
  qualification: ["Intermediate"],
  minHeightMale: 5.3
},

"Army Driver": {
  category: "Pakistan Army",
  minAge: 17.5,
  maxAge: 26,
  qualification: ["Matric", "Intermediate"],
  minHeightMale: 5.6,
  drivingLicense: true
},

"Army Cook": {
  category: "Pakistan Army",
  minAge: 17.5,
  maxAge: 23,
  qualification: ["Middle", "Matric"]
},

// =========================
// PMA LONG COURSE
// =========================

"PMA Long Course": {
  category: "Pakistan Army",
  minAge: 17,
  maxAge: 22,
  qualification: ["Intermediate"]
},

// =========================
// PMA GRADUATE COURSE
// =========================

"PMA Graduate Course": {
  category: "Pakistan Army",
  minAge: 17,
  maxAge: 24,
  qualification: ["Bachelor"]
},

// =========================
// SHORT SERVICE COMMISSION
// =========================

"Army Short Service Commission": {
  category: "Pakistan Army",
  minAge: 18,
  maxAge: 28,
  qualification: ["Bachelor", "Master"]
},

// =========================
// AFNS
// =========================

"AFNS": {
  category: "Pakistan Army",
  minAge: 17,
  maxAge: 25,
  qualification: ["Intermediate"]
},

// =========================
// ISSB
// =========================

"ISSB": {
  category: "Forces",
  minAge: 17,
  maxAge: 24,
  qualification: ["Intermediate", "Bachelor"]
},

// =========================
// PAK NAVY
// =========================

"Pakistan Navy Sailor": {
  category: "Pakistan Navy",
  minAge: 16,
  maxAge: 21,
  qualification: ["Matric"]
},

"Pakistan Navy PN Cadet": {
  category: "Pakistan Navy",
  minAge: 17,
  maxAge: 23,
  qualification: ["Intermediate"]
},

"Pakistan Navy Civilian": {
  category: "Pakistan Navy",
  minAge: 18,
  maxAge: 30,
  qualification: ["Matric", "Intermediate", "Bachelor"]
},

// =========================
// PAK AIR FORCE
// =========================

"PAF Airman": {
  category: "Pakistan Air Force",
  minAge: 16,
  maxAge: 22,
  qualification: ["Intermediate"]
},

"PAF Aero Trade": {
  category: "Pakistan Air Force",
  minAge: 16,
  maxAge: 22,
  qualification: ["Intermediate"]
},

"PAF Education Instructor": {
  category: "Pakistan Air Force",
  minAge: 18,
  maxAge: 28,
  qualification: ["Bachelor"]
},

// =========================
// GDP PILOT
// =========================

"GDP Pilot": {
  category: "Pakistan Air Force",
  minAge: 16,
  maxAge: 22,
  qualification: ["Intermediate"]
},

// =========================
// PAF COMMISSIONED OFFICER
// =========================

"PAF Commissioned Officer": {
  category: "Pakistan Air Force",
  minAge: 17,
  maxAge: 24,
  qualification: ["Intermediate", "Bachelor"]
},

// =========================
// PAKISTAN RANGERS
// =========================

"Pakistan Rangers Sepoy": {
  category: "Pakistan Rangers",
  minAge: 18,
  maxAge: 30,
  qualification: ["Middle", "Matric"]
},

"Pakistan Rangers Clerk": {
  category: "Pakistan Rangers",
  minAge: 18,
  maxAge: 30,
  qualification: ["Intermediate"]
},

"Pakistan Rangers Sub Inspector": {
  category: "Pakistan Rangers",
  minAge: 18,
  maxAge: 30,
  qualification: ["Bachelor"]
},

// =========================
// FRONTIER CORPS
// =========================

"Frontier Corps Soldier": {
  category: "Frontier Corps",
  minAge: 17,
  maxAge: 25,
  qualification: ["Matric"]
},

"Frontier Corps Clerk": {
  category: "Frontier Corps",
  minAge: 18,
  maxAge: 28,
  qualification: ["Intermediate"]
},

"Frontier Corps SI": {
  category: "Frontier Corps",
  minAge: 18,
  maxAge: 30,
  qualification: ["Bachelor"]
}
,

// =========================
// ANTI NARCOTICS FORCE (ANF)
// =========================

"ANF Constable": {
  category: "ANF",
  minAge: 18,
  maxAge: 25,
  qualification: ["Intermediate"]
},

"ANF ASI": {
  category: "ANF",
  minAge: 18,
  maxAge: 30,
  qualification: ["Bachelor"]
},

"ANF Sub Inspector": {
  category: "ANF",
  minAge: 18,
  maxAge: 30,
  qualification: ["Bachelor"]
},

// =========================
// INTELLIGENCE BUREAU (IB)
// =========================

"IB GD": {
  category: "Intelligence Bureau",
  minAge: 18,
  maxAge: 30,
  qualification: ["Bachelor"]
},

"IB Stenotypist": {
  category: "Intelligence Bureau",
  minAge: 18,
  maxAge: 30,
  qualification: ["Intermediate"]
},

"IB Data Entry Operator": {
  category: "Intelligence Bureau",
  minAge: 18,
  maxAge: 30,
  qualification: ["Intermediate", "Bachelor"],
  computerSkills: true
},

// =========================
// NAB
// =========================

"NAB Assistant Director": {
  category: "NAB",
  minAge: 21,
  maxAge: 35,
  qualification: ["Bachelor", "Master"]
},

"NAB Junior Expert": {
  category: "NAB",
  minAge: 21,
  maxAge: 35,
  qualification: ["Bachelor"]
},

// =========================
// NADRA
// =========================

"NADRA Data Entry Executive": {
  category: "NADRA",
  minAge: 18,
  maxAge: 30,
  qualification: ["Intermediate", "Bachelor"],
  computerSkills: true
},

"NADRA Junior Executive": {
  category: "NADRA",
  minAge: 18,
  maxAge: 30,
  qualification: ["Intermediate"]
},

// =========================
// WAPDA
// =========================

"WAPDA Clerk": {
  category: "WAPDA",
  minAge: 18,
  maxAge: 30,
  qualification: ["Intermediate"]
},

"WAPDA Assistant": {
  category: "WAPDA",
  minAge: 18,
  maxAge: 30,
  qualification: ["Bachelor"]
},

"WAPDA Data Entry Operator": {
  category: "WAPDA",
  minAge: 18,
  maxAge: 30,
  qualification: ["Intermediate", "Bachelor"],
  computerSkills: true
},

// =========================
// PAKISTAN RAILWAYS
// =========================

"Railway Clerk": {
  category: "Pakistan Railways",
  minAge: 18,
  maxAge: 30,
  qualification: ["Intermediate"]
},

"Railway Commercial Clerk": {
  category: "Pakistan Railways",
  minAge: 18,
  maxAge: 30,
  qualification: ["Intermediate"]
},

"Railway Assistant": {
  category: "Pakistan Railways",
  minAge: 18,
  maxAge: 30,
  qualification: ["Bachelor"]
},

// =========================
// EDUCATION DEPARTMENT
// =========================

"Elementary School Teacher": {
  category: "Education",
  minAge: 18,
  maxAge: 35,
  qualification: ["Bachelor"]
},

"Secondary School Teacher": {
  category: "Education",
  minAge: 21,
  maxAge: 35,
  qualification: ["Master"]
},

"Lecturer": {
  category: "Education",
  minAge: 21,
  maxAge: 35,
  qualification: ["Master"]
},

// =========================
// HEALTH DEPARTMENT
// =========================

"Staff Nurse": {
  category: "Health",
  minAge: 18,
  maxAge: 35,
  qualification: ["Intermediate", "Bachelor"]
},

"Medical Officer": {
  category: "Health",
  minAge: 22,
  maxAge: 35,
  qualification: ["Bachelor", "Master"]
},

// =========================
// COURTS
// =========================

"Court Clerk": {
  category: "Courts",
  minAge: 18,
  maxAge: 30,
  qualification: ["Intermediate"]
},

"Judicial Assistant": {
  category: "Courts",
  minAge: 18,
  maxAge: 30,
  qualification: ["Bachelor"]
},

"Stenographer": {
  category: "Courts",
  minAge: 18,
  maxAge: 30,
  qualification: ["Intermediate"]
},

// =========================
// BANKING
// =========================

"Bank Cash Officer": {
  category: "Banking",
  minAge: 18,
  maxAge: 30,
  qualification: ["Bachelor"]
},

"Bank Officer": {
  category: "Banking",
  minAge: 21,
  maxAge: 30,
  qualification: ["Bachelor"]
},

"Relationship Officer": {
  category: "Banking",
  minAge: 21,
  maxAge: 30,
  qualification: ["Bachelor"]
}




};

module.exports = jobsRules;

