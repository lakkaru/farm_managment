// Sri Lankan Administrative Divisions
// District -> Divisional Secretariats -> Grama Niladhari Divisions

const ADMINISTRATIVE_DIVISIONS = {
  'Colombo': {
    province: 'Western',
    divisionalSecretariats: [
      { 
        name: 'Colombo', 
        gnDivisions: ['Sammanthranapura', 'Mattakkuliya', 'Modara', 'Madampitiya', 'Mahawatta', 'Aluthmawatha', 'Lunupokuna', 'Bloemendhal', 'Kotahena East', 'Kotahena West', 'Kochchikade North', 'Jinthupitiya', 'Massangar Street', 'New Bazaar', 'Grandpass South', 'Grandpass North', 'Nawagampura', 'Maligawatta East', 'Kettarama', 'Aluthkade East', 'Aluthkade West', 'Kochchikade South', 'Pettah', 'Fort', 'Galle Face', 'Slave Island', 'Hunupitiya', 'Suduwella', 'Keselwatta', 'Panchikawatta', 'Maligawatta West', 'Maligakanda', 'Maradana', 'Ibbanwala', 'Wekanda'] 
      },
      { 
        name: 'Kolonnawa', 
        gnDivisions: ['Wadulla', 'Sedawatta', 'Halmulla', 'Kotuvila', 'Veheragoda', 'Orugodawatta', 'Meethotamulla', 'Welewaththa', 'Kiththampahuwa', 'Wennawatta', 'Mahabuthgamuwa B', 'Kuda Buthgamuwa', 'Kelanimulla', 'Ambathale', 'Mulleriyawa North', 'Belagama', 'Kotikawatta East', 'Maha Buthgamuwa A', 'Maha Buthgamuwa C', 'Wellampitiya', 'Kuriniyawatta', 'Kolonnawa', 'Dahampura', 'Singhapura', 'Megoda Kolonnawa', 'Bopeththa', 'Batalandahena', 'Kotikawatta West', 'Mulleriyawa South', 'Malgama', 'Udumulla North', 'Maligagodella', 'Rajasinghagama', 'Udumulla South', 'Himbutana East', 'Himbutana West', 'Malpura', 'Gothatuwa New Town', 'Kajugahawatta', 'Gothatuwa', 'Salamulla', 'Wijayapura', 'Gajabapura', 'Madinnagoda', 'Elhena', 'Dodamgahahena'] 
      },
      { 
        name: 'Kaduwela', 
        gnDivisions: ['Welivita', 'Raggahawatta', 'Hewagama', 'Kaduwela', 'Pahala Bomiriya', 'Ihala Bomiriya', 'Wekewatta', 'Nawagamuwa', 'Pahala Bomiriya B', 'Welihinda', 'Kothalawala', 'Mahadeniya', 'Thalahena North', 'Malabe North', 'Thunadahena', 'Korathota', 'Nawagamuwa South', 'Batewela', 'Ranala', 'Dedigamuwa', 'Embilladeniya', 'Welipillewa', 'Shanthalokagama', 'Pore', 'Malabe East', 'Malabe West', 'Thalangama North B', 'Thalahena South', 'Muttettugoda', 'Thalangama North A', 'Walpola', 'Kalapaluwawa', 'Kotuwegoda', 'Subhoothipura', 'Udumulla', 'Battaramulla North', 'Batapotha', 'Pothuarawa', 'Hokandara North', 'Oruwala', 'Athurugiriya', 'Thaldiyawala', 'Boralugoda', 'Hokandara East', 'Arangala', 'Evarihena', 'Kumaragewatta', 'Jayawadanagama', 'Aruppitiya', 'Asiri Uyana', 'Battaramulla South', 'Rajamalwatta', 'Pahalawela', 'Wickramasinghapura', 'Wellangiriya', 'Hokandara South', 'Athurugiriya South'] 
      },
      { 
        name: 'Homagama', 
        gnDivisions: ['Jalthara', 'Henpita', 'Atigala West', 'Atigala East', 'Batawala', 'Walpita', 'Nawalamulla', 'Meegasmulla', 'Habarakada North', 'Mullegama North', 'Mullegama South', 'Habarakada South', 'Panagoda Town', 'Henawatta', 'Meegoda North', 'Panaluwa', 'Watareka North', 'Meegoda South', 'Godagama North', 'Panagoda West', 'Panagoda East', 'Habarakada Watta', 'Homagama North', 'Homagama West', 'Homagama South', 'Galavilawatta North', 'Homagama Town', 'Homagama East', 'Pitipana Town', 'Godagama South', 'Kurunduwatta', 'Gehenuwala', 'Watareka South', 'Ovitigama', 'Kandhanawatta', 'Kiriberiyakele', 'Mawathagama', 'Katuwana', 'Galavilawatta South', 'Niyadagala', 'Hiripitiya', 'Mambulgoda', 'Kithulhena', 'Siddamulla North', 'Siddamulla South', 'Mattegoda West', 'Mattegoda Central A', 'Mattegoda East', 'Brahmanagama', 'Deepangoda', 'Magammana West', 'Magammana East', 'Uduwana', 'Prasannapura', 'Pitipana North', 'Suwapubudugama', 'Pitipana South', 'Dolahena', 'Diyagama East', 'Diyagama West', 'Kirigampamunuwa', 'Mattegoda Central B', 'Siyambalagoda North', 'Kudamaduwa', 'Sangarama', 'Siyambalagoda South', 'Rilawala', 'Kahathuduwa West', 'Kiriwattuduwa South', 'Kiriwattuduwa North', 'Moonamale -Yakahaluwa', 'Kithulavila', 'Kahathuduwa North', 'Kahathuduwa East', 'Kahathuduwa South', 'Undurugoda', 'Wethara', 'Ambalangoda', 'Heraliyawala', 'Palagama', 'Weniwelkola'] 
      },
      { 
        name: 'Hanwella', 
        gnDivisions: ['Bollathawa', 'Kanampella West', 'Kanampella East', 'Manakada', 'Eswatta North', 'Kiriwandala North', 'Kudagama', 'Weralupitiya', 'Seethagama', 'Avissawella', 'Ukwatta', 'Agra place', 'Eswatta South', 'Ihala Kosgama North', 'Thawalgoda', 'Muruthagama', 'Akaravita', 'Kahatapitiya', 'Kalu Aggala', 'Salawa', 'Pahala Kosagama West', 'Pahala Kosgama East', 'Ihala Kosgama South', 'Miriswatta', 'Aluth Ambalama', 'Kiriwandala South', 'Kotahera', 'Seethawaka', 'Aradhana Kanda', 'Puwakpitiya South', 'Puwakpitiya', 'Egodagama', 'Weragolla North', 'Hingurala', 'Kadugoada North', 'Mawalgama', 'Suduwella', 'Gira Imbula', 'Walauwathta', 'Pahala Hanwella', 'Hanwella Town', 'Ihala Hanwella North', 'Niripola', 'Brandigampala', 'Kadugoda South', 'Weragolla South', 'Digana', 'Lahirugama', 'Mabula', 'Welikanna', 'Kahahena', 'Neluwattuduwa', 'Diddeniya North', 'Ihala Hanwella South', 'Pahathgama', 'Jayaweeragoda', 'Koodaluvila', 'Thunnana East', 'Diddeniya South', 'Elamalawala', 'Ilukovita', 'Koswatta', 'Pagnagula', 'Pelpola', 'Kudakanda', 'Thunnana West', 'Mawathagama West', 'Mawathagama East'] 
      },
      { 
        name: 'Padukka', 
        gnDivisions: ['Pinnawala North', 'Pinnawala South', 'Waga North', 'Waga East', 'Thummodara', 'Waga South', 'Siyambalawa', 'Pahala Bope', 'Halpe', 'Waga West', 'Uggalla', 'Wewelpanawa', 'Pitumpe North', 'Pitumpe South', 'Galagedara East', 'Galagedara North', 'Galagedara South', 'Padukka', 'Arukwatta North', 'Arukwatta South', 'Ganegoda', 'Angampitiya', 'Weragala', 'Angamuwa', 'Udumulla', 'Poregedara', 'Pahala Padukka', 'Liyanwala', 'Kurugala', 'Madulawa South', 'Madulawa North', 'Horakandawala', 'Dampe', 'Beruketiya', 'Horagala West', 'Horagala East', 'Beliattavila', 'Miriyagalla', 'Malagala', 'Kahawala', 'Yatawathura', 'Mahingala', 'Ihala Bope', 'Gurulana', 'Udagama', 'Dabora'] 
      },
      { 
        name: 'Maharagama', 
        gnDivisions: ['Mirihana South', 'Mirihana North', 'Madiwela', 'Thalawathugoda West', 'Thalawathugoda East', 'Kalalgoda', 'Kottawa East', 'Rukmale West', 'Rukmale East A', 'Rukmale East B', 'Liyanagoda', 'Kottawa North', 'Depanama', 'Polwatta', 'Pamunuwa', 'Thalapathpitiya', 'Pragathipura', 'Udahamulla East', 'Udahamulla West', 'Pathiragoda', 'Maharagama East', 'Maharagama West', 'Dambahena', 'Pannipitiya North', 'Kottawa West', 'Kottawa South', 'Malapalla West', 'Malapalla East', 'Makumbura North', 'Makumbura South', 'Kottawa Town', 'Pannipitiya South', 'Maharagama Town', 'Godigamuwa South', 'Godigamuwa South B', 'Godigamuwa North', 'Wattegedara', 'Navinna', 'Wijerama', 'Gangodavila South B', 'Jambugasmulla'] 
      },
      { 
        name: 'Sri Jayawardanapura Kotte', 
        gnDivisions: ['Obesekarapura', 'Welikada West', 'Welikada East', 'Rajagiriya', 'Welikada North', 'Nawala West', 'Koswatta', 'Ethulkotte West', 'Ethulkotte', 'Pitakotte East', 'Pitakotte', 'Pitakotte West', 'Nawala East', 'Nugegoda West', 'Pagoda', 'Nugegoda', 'Pagoda East', 'Gangodavila North', 'Gangodavila South', 'Gangodavila East'] 
      },
      { 
        name: 'Thimbirigasyaya', 
        gnDivisions: ['Kollupitiya', 'Bambalapitiya', 'Kurunduwatta', 'Kuppiyawatta West', 'Kuppiyawatta East', 'Dematagoda', 'Wanathamulla', 'Borella North', 'Borella South', 'Gothamipura', 'Narahenpita', 'Thimbirigasyaya', 'Milagiriya', 'Havelock Town', 'Kirula', 'Kirulapone', 'Wellawatta North', 'Wellawatta South', 'Pamankada West', 'Pamankada East'] 
      },
      { 
        name: 'Dehiwala-Mount Lavinia', 
        gnDivisions: ['Sri Saranankara', 'Vilawala', 'Dutugemunu', 'Kohuwala', 'Kalubowila', 'Hathbodhiya', 'Galwala', 'Dehiwala West', 'Dehiwala East', 'Udyanaya', 'Nedimala', 'Malwatta', 'Jayathilaka', 'Karagampitiya', 'Kawdana East'] 
      },
      { 
        name: 'Ratmalana', 
        gnDivisions: ['Kawdana West', 'Watarappala', 'Wathumulla', 'Katukurunduwatta', 'Attidiya North', 'Attidiya South', 'Piriwena', 'Wedikanda', 'Vihara', 'Rathmalana West', 'Rathmalana East', 'Kandawala', 'Mount Lavinia (Galawissa)'] 
      },
      { 
        name: 'Moratuwa', 
        gnDivisions: ['Angulana North', 'Kaldemulla', 'Soysapura North', 'Soysapura South', 'Dahampura', 'Thelawala North', 'Borupana', 'Thelawala South', 'Lakshapathiya North', 'Lakshapathiya Central', 'Angulana South', 'Uyana South', 'Uyana North', 'Rawathawatta South', 'Rawathawatta East', 'Lakshapathiya South', 'Kuduwamulla', 'Katubedda', 'Molpe', 'Moratumulla North', 'Kadalana', 'Rawathawatta West', 'Idama', 'Uswatta', 'Moratuwella South', 'Indibedda West', 'Moratumulla East', 'Moratumulla West', 'Villorawatta East', 'Villorawatta West', 'Indibedda East', 'Moratuwella North', 'Moratuwella West', 'Koralawella North', 'Koralawella East', 'Koralawella West', 'Koralawella South', 'Katukurunda North', 'Katukurunda South', 'Egoda Uyana North', 'Egoda Uyana Central', 'Egoda Uyana South'] 
      },
      { 
        name: 'Kesbewa', 
        gnDivisions: ['Pepiliyana West', 'Pepiliyana East', 'Divulpitiya East', 'Divulpitiya West', 'Bellanvila', 'Boralesgamuwa West A', 'Boralesgamuwa West C', 'Rattanapitiya', 'Egodawatta', 'Boralesgamuwa East A', 'Boralesgamuwa West B', 'Werahera North', 'Boralesgamuwa East B', 'Neelammahara', 'Katuwawala North', 'Vishwakalawa', 'Werahera South', 'Katuwawala South', 'Niwanthidiya', 'Erewwala West', 'Erewwala North', 'Erewwala East', 'Rathmaldeniya', 'Mahalwarawa', 'Bangalawatta', 'Pelenwatta East', 'Pelenwatta North', 'Pelenwatta West', 'Paligedara', 'Kaliyammahara', 'Bokundara', 'Thumbovila South', 'Thumbovila North', 'Wewala West', 'Wewala East', 'Thumbovila West', 'Mampe North', 'Makuludoowa', 'Gorakapitiya', 'Nampamunuwa', 'Mavittara North', 'Mampe East', 'Bodhirajapura', 'Mampe West', 'Mampe South', 'Kolamunna', 'Suwarapola East', 'Suwarapola West', 'Hedigama', 'Batakettara North', 'Kesbewa North', 'Kesbewa East', 'Mavittara South', 'Honnanthara North', 'Honnanthara South', 'Makandana East', 'Kesbewa South', 'Batakettara South', 'Madapatha', 'Delthara West', 'Delthara East', 'Dampe', 'Makandana West', 'Nivungama', 'Halpita', 'Horathuduwa', 'Morenda', 'Batuwandara North', 'Batuwandara South', 'Jamburaliya', 'Polhena', 'Regidel Watta', 'Kahapola'] 
      },
    ]
  },
  'Gampaha': {
    province: 'Western',
    divisionalSecretariats: [
      { 
        name: 'Negombo', 
        gnDivisions: ['Kammalthura', 'Pallansena North', 'Kochchikade', 'Pallansena South', 'Daluwakotuwa', 'Palangathure', 'Ettukala', 'Daluwakotuwa East', 'Kattuwa', 'Dalupotha East', 'Dalupotha', 'Kudapaduwa', 'Kudapaduwa North', 'Kudapaduwa South', 'Wella Weediya', 'Wella Weediya East', 'Periyamulla', 'Hunupitiya', 'Angurukaramulla', 'Udayarthoppuwa', 'Wella Weediya South', 'Munnakkarai North', 'Doowa', 'Pitipana North', 'Pitipana Central', 'Munnakkaraya', 'Munnakkarai East', 'Thaladuwa', 'Udayarthoppuwa South', 'Bolawalana', 'Kurana West', 'Kurana East', 'Siriwardana Pedesa', 'South Pitipana East', 'Pitipana South', 'Thalahena', 'Dungalpitiya', 'Seththappaduwa', 'Kepungoda'] 
      },
      { 
        name: 'Katana', 
        gnDivisions: ['Muruthana', 'Manaveriya', 'Udangawa', 'Thoppuwa', 'Bambukuliya', 'Katana North', 'Katana East', 'Katana West', 'Maha Ethgala', 'Ethgala', 'Adikkandiya', 'Welihena North', 'Welihena South', 'Pahala Kandawala', 'Ethgala South', 'Ihala Kandawala', 'Kaluwarippuwa West', 'Kondagammulla', 'Katiyala', 'Kadirana North', 'K.C. De Silvapura', 'Thimbirigaskatuwa', 'Sellakanda', 'Katuwapitiya', 'Mahahunupitiya West', 'Mahahunupitiya East', 'Pahala Kadirana', 'Kadirana', 'Akkara 50', 'Kadirana South', 'Kimbulapitiya West', 'Kimbulapitiya North', 'Kimbulapitiya South', 'Kimbulapitiya Central', 'Andiambalama West', 'Walpola', 'Andiambalama East', 'Dewamottawa', 'Kovinna', 'Evariwatta', 'Air Force Camp', 'Kurana Katunayaka Central', 'Kurana Katunayaka', 'Kurana Katunayaka South', 'Katunayaka North', 'Katunayaka South', 'Walanagoda', 'Kalahapitiya', 'Madawala', 'Muthuwadiya', 'Liyanagemulla North', 'Liyanagemulla South', 'Amandoluwa', 'Thampala', 'Kuswala', 'Ganepola', 'Heenatiyana West', 'Heenatiyana South', 'Heenatiyana East', 'Raddolugama North A', 'Raddolugama North', 'Raddolugama South', 'Raddolugama South A', 'Raddoluwa North', 'Raddoluwa West', 'Seeduwa', 'Mookalangamuwa West', 'Mookalangamuwa East', 'Bandarawatta East', 'Bandarawatta West', 'Dambaduraya', 'Raddoluwa South', 'Lansiyawadiya', 'Kotugoda', 'Kasagahawatta', 'Udammita North', 'Alawathupitiya', 'Udammita South', 'Ambalammulla'] 
      },
      { 
        name: 'Divulapitiya', 
        gnDivisions: ['Andimulla', 'Ambalayaya', 'Bolagala', 'Otharawadiya', 'Godigamuwa West', 'Godigamuwa East', 'Balawala', 'Badalgama', 'Delpakadawara', 'Sirigapathawatta', 'Pethigoda', 'Alugolla', 'Polwatta', 'Polhena', 'Mellawagedara', 'Diklanda', 'Katukenda', 'Akarangaha', 'Kehelella West', 'Lihiniyagammana', 'Akaragama East', 'Akaragama West', 'Akaragama North', 'Pahala Madampella', 'Halpe', 'East Kaluwarippuwa North', 'Koonagodamulla North', 'Kongodamulla West', 'Kongodamulla South', 'Kongodamulla East', 'Ihala Madampella North', 'Ihala Madampella West', 'Ihala Madampella East', 'Ihalagama', 'Kehelella South', 'Kehelella North', 'Delwagura', 'Wekada', 'Kalumada', 'Agalegedara', 'Waradala', 'Kotadeniyawa', 'Erabadda', 'Diyagampala', 'Koradaminna', 'Dimbuldeniya', 'Paragoda North', 'Paragoda South', 'Moragalkanda', 'Nawana West', 'Hettimulla', 'Halloluwa', 'Kelegedara', 'Heeralugedara', 'Walpita', 'Welagana', 'Thammita', 'Palliyapitiya West', 'Induragara North', 'Induragara South', 'Kadawala North', 'Kadawala', 'East Kaluwarippuwa South', 'Miriswatta', 'Dagonna North', 'Dagonna East', 'Halgahawelawatta', 'Katuwellegama North', 'Kadawala South', 'Batepola', 'Doonagaha South', 'Doonagaha', 'Palliyapitiya East', 'Hunumulla', 'Hapugahagama', 'Barawavila', 'Kudagammana', 'Pahala Madithiyawala', 'Kaluaggala', 'Kuleegedara', 'Nawana East', 'Nariyamulla', 'Halpe', 'Parana Halpe West', 'Parana Halpe East', 'Gurullagama', 'Ihala Kithulwala', 'Pahala Kithulwala', 'Kithulwala North', 'Kaluaggala Pahalagama', 'Wattemulla', 'Ihala Madithiyawala', 'Hangawatta', 'Rassapana', 'Balagalla West', 'Parana Handiya', 'Pinnakele', 'Pinnakele South', 'Urapana', 'Kelepitimulla', 'Sayakkaramulla', 'Henpitagedara', 'Aluthepola West', 'Thotillagahawatta', 'Katuwellegama South', 'Palugahawela', 'Dagonna South', 'Hapuwalana South', 'Hapuwalana', 'Bomugammana North', 'Bomugammana South', 'Pinnalanda', 'Divulapitiya', 'Balagalla East', 'Ullapola East', 'Ullapola West', 'Wewagedara', 'Horagasmulla', 'Aswennawatta East', 'Hapuwalana North', 'Aswennawatta West', 'Weragodamulla', 'Aluthepola East'] 
      },
      { 
        name: 'Mirigama', 
        gnDivisions: ['Nalla', 'Giriullagama', 'Loluwagoda', 'Delwala South', 'Delwala', 'Loluwagoda South', 'Madurupitiya', 'Hapugahagedara', 'Kadangamuwa', 'Henegama', 'Maladeniya', 'Kahadawa', 'Kandalama', 'Walbotale', 'Perisyala', 'Kamarangawa', 'Keenadeniya', 'Bothale Pahalagama North', 'Maweehena', 'Kurunduwatta', 'Purana Meerigama', 'Hakurukumbura', 'Mugurugampala', 'Vilwatta', 'Thawalampitiya', 'Bothale Pahalagama', 'Bothale Pahalagama West', 'Bothale Medagama', 'Bothale Pahalagama East', 'Thalagama East', 'Thalagama', 'Balathawa', 'Makura', 'Pottekanda', 'Bothale Iahalagama', 'Adagalakanda', 'Ihala Halugama', 'Kidiwala', 'Pahala Halugama', 'Meerigama', 'Walawwatta', 'Thilinagama', 'Vijayarajadahana', 'Ihala Neligama', 'Neligama Central', 'Neligama', 'Lindara', 'Halugama', 'Siyambalagoda', 'Pahala Lindara', 'Pohonnaruwa', 'Indiparape', 'Kosetadeniya', 'Imbulanwala', 'Uduulla', 'Gaspe', 'Banduragoda', 'Keppitiwalana', 'Gaspe Pahalagama', 'Galgana', 'Pelapitigama', 'Elhena', 'Ganegoda', 'Hiriwala', 'Handurumulla', 'Pamunuwatta', 'Ihala Lindara', 'Arukgoda', 'Madabavita', 'Madabavita Ihalagama', 'Nawgala', 'Danovita', 'Weweldeniya Pahalagama', 'Weweldeniya Pahalagama West', 'Henepola', 'Palmada', 'Kal /Pallewela, Kotakanda', 'Raddelgoda', 'Ihala Bokalagama', 'Pahala Bokalagama', 'Kukulnape', 'Gaspe South', 'Muddaragama', 'Hanchapola', 'Hirikuluwa,Ganemulla,Dathgama', 'Pathagama', 'Borukgamuwa West', 'Borukgamuwa', 'Pallewela', 'Weragoda / Kakkele', 'Hansagiriya', 'Welavilamulla North', 'Welavilamulla', 'Udawela', 'Hapitigama', 'Makkanigoda North', 'Pahalawela', 'Millawala', 'Weweldeniya Ihalagama West', 'Weweldeniya Ihalagama', 'Kotadeniya', 'Ilukpatha / Weragoda', 'Hedidenikanda-Radawadunna', 'Radawadunna', 'Bataleeya', 'Bataleeya South', 'Bolana', 'Mallehewa', 'Wabadamulla', 'Weragoda', 'Midellawala', 'Kendalanda', 'Nungamuwa', 'Uthuwambogahawatta', 'Pahala Maligathenna', 'Maligathenna Central', 'Wandurawa', 'Galgamuwa West', 'Galgamuwa East', 'Kumbaloluwa', 'Ihala Kumbaloluwa', 'Pahala Kumbaloluwa', 'Dumunnegedara South', 'Dumunnegedara - Kalatuwawa', 'Pasyala', 'Pasyala West', 'Muruthawala', 'Kithanawatta', 'Kammalpitiya', 'Radawadunna Central', 'Imbulgasovita', 'Pahala Radawadunna', 'Weerasooriyakanda', 'Pasyala East', 'Udugama', 'Panawala', 'Delgahamedilla', 'Mottunna West', 'Mottunna', 'Maligathenna', 'Kureekotuwa', 'Hakwaduna', 'Pahala Kureekotuwa', 'Ellalamulla', 'Debahera', 'Mawathahena', 'Meevitiya', 'Ketakalapitiya', 'Dambutuwa'] 
      },
      { 
        name: 'Minuwangoda', 
        gnDivisions: ['Medemulla North', 'Nilpanagoda West', 'Nilpanagoda East', 'Nilpanagoda', 'Arangawa', 'Horampella North', 'Galkanda', 'Bodhipihituwala', 'Watinapaha', 'Mabodala West', 'Mabodala North', 'Ihala Vithanamulla', 'Nalapaha', 'Pahala Vithanamulla', 'Mabodala East', 'Mabodala South', 'Watinapaha South', 'Wankepumulla', 'Kamaragoda', 'Kudagoda', 'Horampella South', 'Mahagama', 'Wegowwa South', 'Minuwangoda East', 'Minuwangoda North', 'Medemulla South', 'Boragodawatta North', 'Yatiyana', 'Peellawatta', 'Unnaruwa', 'Yatiyana Central', 'Yatiyana East', 'Kopiwatta', 'Boragodawatta South', 'Minuwangoda West', 'Meda Minuwangoda', 'Pansilgoda', 'Wegowwa East', 'Helakandana', 'Peralanda', 'Dewalapola', 'Wadumulla', 'Metikotumulla', 'Essella', 'Yatagama', 'Naiwala North', 'Naiwala East', 'Naiwala West', 'Walpitamulla', 'Balabowa', 'Balabowa West', 'Pethiyagoda North', 'Gallegedara', 'Ganihimulla', 'Hendimahara', 'Kalawana', 'Wattegedara', 'Ambagahawatta', 'Galloluwa East', 'Galloluwa', 'Kalahugoda', 'Polwatta West', 'Polwatta East', 'Pattanduwana North', 'Ellangala', 'Burullapitiya', 'Mathammana', 'Weediyawatta East', 'Goigama', 'Ihala Udugampola', 'Pethiyagoda South', 'Korase', 'Korase Meda', 'Marapola', 'Vigoda', 'Doranagoda East', 'Korase East', 'Doranagoda North', 'Doranagoda West', 'Pahala Udugampola East', 'Pahala Udugampola North', 'Pahala Udugampola West', 'Weediyawatta West', 'Welhena', 'Weliya', 'Paththaduwana', 'Paththaduwana West', 'Yagodamulla North', 'Yagodamulla', 'Uggalboda West', 'Uggalboda', 'Kehelbaddara West', 'Kehelbaddara East', 'Pahala Udugampola South', 'Asgiriwalpola North', 'Dombawela', 'Pedipola', 'Doranagoda South', 'Wathumulla', 'Asgiriya North', 'Asgiriya South', 'Asgiriya', 'Asgiriya West', 'Asgiriwalpola South', 'Asgiriwalpola West', 'Madelgamuwa East', 'Batapotha', 'Nedagamuwa North', 'Nedagamuwa South', 'Nedagamuwa West', 'Arachchiwatta', 'Yagodamulla South', 'Samurdhigama', 'Opatha', 'Kotugoda2', 'Kotugoda1', 'Maduruwita', 'Siyambalapitiya', 'Madelgamuwa West', 'Thammita West', 'Thammita'] 
      },
      { 
        name: 'Wattala', 
        gnDivisions: ['Pamunugama', 'Maha Pamunugama', 'West of Delathura', 'East of Delathura', 'Bopitiyathuduwa', 'Bopitiya', 'Pulluhena', 'Paranambalama', 'Nugape', 'Kunjawaththa', 'Magulpokuna', 'Elehiwaththa', 'Welisara', 'Pattiyawala', 'Uswetakeiyawa', 'Mahabage', 'Elapitiwala', 'Horapethuduwa', 'Horape', 'North of Kurukualawa', 'South of Kurukulawa', 'Heenkenda', 'Thuduwegedara', 'Galudupita', 'Maththumagala', 'Kernga Pokuna', 'Kerawalapitiya', 'Matagoda', 'Balagala', 'Dikovita', 'Palliyawatta North', 'Elakanda', 'North of Nayaka Kanda', 'Mabola', 'Welikadamulla', 'Wattala', 'Hendala North', 'Hendala South', 'Nayak Kanda South', 'Thimbirigasyaya', 'Palliyawatta South', 'Kurunduhena', 'Evariwatta', 'Thelagapatha', 'Galwetiya', 'Hekiththa'] 
      },
      { 
        name: 'Ja-Ela', 
        gnDivisions: ['Mahawatta', 'Dandugama', 'Dehiyagatha North', 'Kudahakapola North', 'Gallawatta', 'Ekala', 'Dehiyagatha South', 'Kudahakapola South', 'Ekala Kurunduwatta', 'Vishaka Watta', 'Thudella North', 'Thudella West', 'Thudella South', 'Kanuwana', 'Alexendrawatta', 'Bandigoda', 'Yakkaduwa', 'Niwandama North', 'Niwandama South', 'Batagama North', 'Maeliya', 'Ja-Ela', 'Weligampitiya North', 'Indipitiya', 'Wewala', 'Weligampitiya South', 'Thumpeliya', 'Indiminna', 'Dolahena', 'Hapugoda West', 'Kapuwatta', 'Kalaeliya', 'Nedurupitiya', 'Rilavulla', 'Kandana East', 'Kandana West', 'Uswatta', 'Hapugoda Central', 'Batagama South', 'Polpitimookalana', 'Batuwatta West', 'Batuwatta East', 'Walpola East', 'Jayasrigama', 'Hapugoda East', 'Nagoda', 'Jayasamarugama', 'Peralanda', 'Podiveekumbura', 'Walpola West', 'Narangodapaluwa West', 'Narangodapaluwa East', 'Thewatta', 'Ragama', 'Ketagewatta', 'Dambuwa', 'Rampitiya'] 
      },
      { 
        name: 'Gampaha', 
        gnDivisions: ['Makevita North', 'Makevita South', 'Mabima', 'Gonagaha2', 'Welikada', 'Gonagaha1', 'Ambanvita', 'Kirindivita', 'Akaravita', 'Pahalagama', 'Medagama 2', 'Ihalagama West', 'Ihalagama East', 'Gampaha Aluthgama North', 'Karanayakamulla', 'Baduwathugoda', 'Boraliyawatha', 'Thittalapitigoda', 'Aluthgama Bogamuwa North', 'Aluthgama Bogamuwa South', 'Mahipalagoda', 'Morenna', 'Weediyawatta', 'Keselwathugoda North', 'Indigolla', 'Gampaha Aluthgama West', 'Bendiyamulla North', 'Medagama 4', 'Medagama 3', 'Medagama 1', 'Oruthota South', 'Kosovita', 'Rathmalavita', 'Makilangamuwa', 'Horagolla North', 'Thibbotugoda', 'Midellavita', 'Kudabollatha', 'Bollatha North', 'Wewel Agara', 'Bollatha West', 'Bollatha South', 'Bulugahagoda West', 'Bulugahagoda East', 'Galahitiyawa North', 'Horagolla South', 'Neduna', 'Pahalayagoda', 'Oruthota North', 'Moragoda1', 'Bendiyamulla West', 'Kidagammulla', 'Bendiyamulla East', 'Gampaha Aluthgama East', 'Keselwathugoda South', 'Yakkala North', 'Galthotamulla', 'Yakkala West', 'Pepolgahadeniya', 'Yakkala East', 'Yakkala South', 'Henarathgoda', 'Mudungoda West', 'Moragoda 2', 'Ihala Yagoda North', 'Mahena', 'Ganemulla South', 'Ganemulla North', 'Galahitiyawa East', 'Galahitiyawa South', 'Kossinna East', 'Amunugoda North', 'Ihala Yagoda South', 'Mudungoda South', 'Mudungoda North', 'Godagedara', 'Rathupaswala', 'Galloluwa', 'Belummahara', 'Ihala Imbulgoda North', 'Ihala Imbulgoda South', 'Pahala Imbulgoda South', 'Pahala Imbulgoda West', 'Amunugoda South', 'Parakandeniya North1', 'Kossinna West1', 'Katuwalamulla North', 'Kossinna West2', 'Katuwalamulla South', 'Parakandeniya North2', 'Parakandeniya South', 'Pahala Imbulgoda East', 'Embaraluwa North 2', 'Embaraluwa North 1', 'Weliweriya West', 'Nedungamuwa', 'Weliweriya East', 'Weliweriya North', 'Weliweriya South', 'Embaraluwa South1', 'Embaraluwa South 2'] 
      },
      { 
        name: 'Attanagalla', 
        gnDivisions: ['Eluwapitiya West', 'Eluwapitiya', 'Hiripitiya West', 'Hiripitiya North', 'Hiripitiya Central', 'Hiripitiya East', 'Thalgasmote West', 'Thalgasmote', 'Thalgasmote East', 'Udammita', 'Humbutiyawa West', 'Humbutiyawa', 'Parana Veyangoda', 'Kongasdeniya', 'Wedagama', 'Kalalpitiya', 'Nawagamuwa', 'Napagoda', 'Nittambuwa South', 'Nittambuwa North', 'Nittambuwa East', 'Kolawatta', 'Pattalagedara East', 'Pattalagedara', 'Hiripitiya South', 'Wataddara', 'Wataddara West', 'Magalegoda', 'Magalegoda South', 'Heendeniya', 'Pattigoda', 'Wataddara South', 'Pahala Hiripitiya', 'Danvilana', 'Dadagamuwa East', 'Pinnagolla', 'Egoda Nittambuwa', 'Horagollagama', 'Nambadaluwa West', 'Nambabaluwa East', 'Ranpokunagama A Zone', 'Ellakkala West', 'Maimbula', 'Ranpokunagama E Zone', 'Ranpokunagama D Zone', 'Ranpokunagama C Zone', 'Ranpokunagama B Zone', 'Maduwegedara', 'Yatiyana', 'Orchardwatta', 'Malwatta', 'Thihariya North', 'Katuwasgoda west', 'Katuwasgoda', 'Dadagamuwa', 'Mudagamuwa', 'Bandarabatawala', 'Pitiyegedara', 'Daraluwa', 'Bemmulla', 'Kandaoluwawa', 'Raniswala', 'Sapugasthenna', 'Thiriwanegama South', 'Thiriwanegama North', 'Halgampitiya', 'Kalagedihena', 'Thihariyagama', 'Thihariya East', 'Kalotuwawa', 'Kattota', 'Orchardwatta South', 'Bogoda', 'Mathalana West', 'Wathupitiwala', 'Walpola', 'Haggalla', 'Ellakkala', 'Godagama West', 'Godagama', 'Welikadamulla', 'Karasnagala', 'Alawala', 'Ethaudakanda', 'Alawala South', 'Nikahetikanda', 'Karasnagala South', 'Palkumbura', 'Pelpita', 'Walaliyadda', 'Haggalla East', 'Diyakade', 'Welagedara', 'Kamburagalla', 'Mathalana North', 'Mathalana', 'Meewala', 'Kitttammahara', 'Thihariya South', 'Pahala Thihariya', 'Thihariya West', 'Bogamuwa', 'Mangalathiriya', 'Pilankada', 'Bonegala', 'Meewala West', 'Udugoda West', 'Mathalana East', 'Udugoda', 'Pannila', 'Hunupola', 'Halpandeniya', 'Urapola', 'Wanduramulla', 'Deenapamunuwa West', 'Deenapamunuwa', 'Yatawaka', 'Sapugasthenna', 'Bopagama', 'Bopagama East', 'Meevitagammana', 'Bopetta South', 'Bopetta', 'Nagoda', 'Kurawalana', 'Kahatovita', 'Kahatovita West', 'Ogodapola North', 'Ogodapola', 'Kahambiliyahena', 'Udathuththiripitiya', 'Mattagoda', 'Weerangula', 'Weerangula South', 'Koskandawala North', 'Kirikittamulla', 'Kirikittamulla South', 'Koskandawala', 'Opathella', 'Paranagama', 'Paranagama East', 'Aruppassa', 'Madaotuwa West', 'Madakotuwa', 'Rathambale', 'Walgammulla', 'Ruwanpura', 'Lavulupitiya', 'Galboda', 'Dematalanda', 'Happitiya'] 
      },
      { 
        name: 'Dompe', 
        gnDivisions: ['Maryland Colony', 'Indurugalla', 'Wathurugama', 'Bandaranayakapura West', 'Bandaranayakapura East', 'Mailawalana', 'Mailawalana South', 'Thimbirigama', 'Mahal Loluwa', 'Ihala Millathe', 'Pingamuwa', 'Pahala Millathe', 'Millathe', 'Kirindiwela', 'Bogahawatta', 'Rambutanwatta', 'Etambagahawatta', 'Kannimahara', 'Radawana North', 'Palupelpita', 'Kithulakanda', 'Radawana South', 'Alliyawatta', 'Diyawala North', 'Diyawala', 'Meddegama', 'Udagama', 'Vihara Kumbura', 'Kuttivila', 'Thalgaswatta', 'Kendagolla', 'Udawela', 'Kirimatiyawatta', 'Hiswella', 'Kiriwana', 'Meddegama North', 'Meddegama South', 'Werahera', 'Pallegama South', 'Pallegama', 'Anuragoda', 'Weralugampala', 'Nedungolla South', 'Nedungolla', 'Nandarama Pedesa', 'Mandawala North', 'Mawatha', 'Parakadamulla', 'Nakandapola', 'Keragala', 'Weliketiyawatta', 'Kurunduhena', 'Baduwatta', 'Mandawala South', 'Anuragoda South', 'Walpola', 'Pepiliyawala', 'Ganihagama North', 'Watawala', 'Meethirigala', 'Polhena', 'Ganihagama South', 'Dangalla North', 'Meniklanda', 'Pelpita', 'Punchi Mandawala', 'Waharaka', 'Putupagala', 'Walaramba', 'Demalagama', 'Helummahara', 'Pananwala', 'Egoda Pelahela', 'Pelahela', 'Madurawa', 'Kajugaswatta', 'Ihala Lunugama', 'Meegahawatta', 'Yakambe', 'Pattiyagama', 'Dangalla', 'Ranwala', 'Wedagama', 'Udugama', 'Udugama', 'Udakananpella South', 'Udakanampella', 'Senasungoda', 'Poogoda', 'Bangalawatta', 'Kumarimulla', 'Ovitigama', 'Parathapakanda', 'Dethemulla', 'Pahala Lunugama', 'Wanaluwawa North', 'Thelkekuna', 'Indolamulla', 'Parangoda', 'Namaluwa', 'Dekatana', 'Narampola', 'Kalukondayawa West', 'Kalukondayawa East', 'Galwalagoda', 'Ganegoda', 'Dompe', 'Iddamaldeniya', 'Guruwala', 'Egoda Guruwala', 'Wanaluwawa South', 'Giridara West', 'Galpothugoda', 'Nikawala', 'Kapugoda', 'Giridara', 'Malinda East', 'Malinda', 'Palugama', 'Degawatta', 'Pahala Dompe', 'Malwana', 'Pahala Mapitigama', 'Morahena', 'Kimbulvilawatta', 'Udamapitigama', 'Udamapitigama South', 'Palugama West', 'Welgama', 'Lansiyahena', 'Samanabedda North', 'Mahawalawatta', 'Thittapattara', 'Samanabedda'] 
      },
      { 
        name: 'Mahara', 
        gnDivisions: ['Kimbulgoda', 'Pituwalgoda', 'Kinigama', 'Maharagama', 'Siwralumulla', 'Pilikuththuwa', 'Yongammulla', 'Ambgaspitiya', 'Warapalana', 'Kandumulla', 'Pasgammana', 'Maligathenna', 'Batepola North', 'Batepola', 'Amunukumbura', 'Malwathuhiripitiya', 'Buthpitiya North', 'Uruwala East', 'Uruwala West', 'Buthpitiya South', 'Neelamahara North', 'Neelamahara South', 'Aramangoda North', 'Puwakpitiya', 'Amunukumbura South', 'Balivila', 'Vilimbula North', 'Vilimbula South', 'Aramangoda', 'Kahatana', 'Henegama', 'Etikehelgalla East', 'Etikehelgalla West', 'Kirikitta North', 'Kirikitta East', 'Kirikitta West', 'Ahugammana', 'Naranwala South', 'Naranwala', 'Udupila East', 'Udupila South', 'Udupila North', 'Webada South', 'Webada North', 'Webada West', 'Kirillawala North', 'Kirillawala', 'Kirillawala West', 'Sooriyapaluwa North', 'Kendaliyeddapaluwa East', 'Kendaliyeddapaluwa North', 'Dangahawela', 'Kendaliyeddapaluwa West', 'Mahara Nugegoda North', 'Mahara Nugedoga West', 'Mahara Nugegoda East', 'Sooriyapaluwa East', 'Sooriyapaluwa South', 'Ranmuthugala', 'Kirillawala South', 'Webada East', 'Gonahena East', 'Gonahena North', 'Gonahena South', 'Gonahena West', 'Eldeniya East', 'Eldeniya West', 'Puwakwetiya', 'Ihala Karagahamuna South', 'Ihala Karagahamuna East', 'Ihala Karagahamuna North', 'Mahara Nugegoda South', 'Neligama', 'Pahala Karagahamuna North', 'Pahala Karagahamuna East', 'Pahala Karagahamuna West', 'Kopiwatta', 'Dalupitiya East', 'Kirimetiyagara', 'Dalupitiya South', 'Dalupitiya West', 'Pinnameda West', 'Gongithota', 'Appugewatta', 'Gongithota West', 'Enderamulla South', 'Enderamulla East', 'Pinnameda', 'Nathuduwa', 'Enderamulla West', 'Nathuduwa West', 'Akbar Town'] 
      },
      { 
        name: 'Kelaniya', 
        gnDivisions: ['Welegoda', 'Hunupitiya North', 'Nahena', 'Eriyawetiya', 'Kiribathgoda', 'Thalawathuhenpita North', 'Thalawathuhenpita South', 'Kendahena', 'Egoda Eriyawetiya', 'Hunupitiya East', 'Hunupitiya South', 'Wanawasala West', 'Wanawasala East', 'Dippitigoda', 'Weweldoowa', 'Warakanatta', 'Koholvila', 'Dalugamgoda', 'Nungamugoda', 'Dalugama', 'Himbutuwelgoda', 'Pattiya East', 'Pattiya North', 'Meegahawatta', 'Peliyagodawatta', 'Peliyagoda Gangabada', 'Peliyagoda Gangabada East', 'Pattiya West', 'Wedamulla', 'Galborella', 'Polhena', 'Kelaniya', 'Sinharamulla North', 'Pilapitiya', 'Pethiyagoda', 'Mawella', 'Sinharamulla'] 
      },
      { 
        name: 'Biyagama', 
        gnDivisions: ['Pahala Biyanvila East', 'Ihala Biyanvila North', 'Ihala Biyanvila Central', 'Mawaramandiya', 'Meegahawatta West', 'Meegahawatta East', 'Kammalwatta', 'Delgoda', 'Athurumulla', 'Kanduboda East', 'Kanduboda West', 'Siyambalape Watta', 'Daranagama', 'Siyambalape North', 'Heiyanthuduwa North', 'Makola South Ihala', 'Makola North Ihala', 'Makola North Central', 'Pahala Biyanvila West', 'Pahala Biyanvila Central', 'Makola North Pahala', 'Makola South Pahala', 'Pamunuvila', 'Gonawala East', 'Sapugaskanda', 'Heiyanthuduwa West', 'Heiyanthuduwa East', 'Siyambalape South', 'Yatihena', 'Ulahitiwala', 'Walgama West', 'Biyagama North', 'Biyagama West', 'Heiyanthuduwa South', 'Mabima East', 'Mabima West', 'Pattivila North', 'Gonawala Central', 'Galeadanda', 'Gonawala West', 'Thalwatta', 'Bollagala', 'Pattivila South', 'Biyagama South', 'Biyagama East', 'Yabaraluwa North', 'Yabaraluwa South', 'Malwana Town', 'Walgama East'] 
      },
    ]
  },
  'Kalutara': {
    province: 'Western',
    divisionalSecretariats: [
      { 
        name: 'Panadura', 
        gnDivisions: ['Horethuduwa North', 'Horethuduwa', 'Horethuduwa Central', 'Horethuduwa South', 'Gorakana', 'Gorakana South', 'Paratta West', 'Paratta', 'Diggala', 'Keselwatta', 'Sarikkamulla', 'Henamulla', 'Wattalpola', 'Miriyawatta', 'Thotawatta', 'Werawatta', 'Pallimulla', 'Gorakapola', 'Walana North', 'Ambalanduwa', 'Galthude North', 'Galthude', 'Hirana West', 'Hirana', 'Thanthirimulla East', 'Thanthirimulla', 'Bekkegama', 'Walana South', 'Walana', 'Udahamulla', 'Punchideniya', 'Malamulla West', 'Kiriberiya', 'Malamulla', 'Kuruppumulla', 'Atambagoda', 'Pattiya North', 'Bazaar North', 'Sagara Place', 'Bazaar West', 'Bazaar', 'Walapala Pattiya', 'Walapala', 'Eluwila', 'Wekada East', 'Wekada North', 'Wekada West', 'Pattiya', 'Uyankele', 'Pattiya South', 'Kaludewala', 'Kaludewala East', 'Morawinna', 'Nalluruwa North', 'Nalluruwa', 'Dibbedda', 'Dibbedda North', 'Narampitiya', 'Pinwatta', 'Pinwatta West', 'Thalpitiya North', 'Thalpitiya South', 'Pallimankada', 'Wadduwa West', 'Wadduwa East', 'Maha Wadduwa', 'Pattieliya', 'Kuda Wadduwa', 'Wadduwa South', 'Molligoda', 'Molligoda North', 'Molligoda South'] 
      },
      { 
        name: 'Bandaragama', 
        gnDivisions: ['Kidelpitiya West', 'Kidelpitiya East', 'Senapura', 'Newdawa', 'Aluthgama', 'Elothiyawa', 'Walgama North', 'Rerukana', 'Samaranayakapura', 'Kothalawala', 'Veedagama East', 'Walgama South', 'Gammanpila', 'Medagama', 'Alubomulla East', 'Kuda Aruggoda East', 'Maha Aruggoda', 'Kuda Aruggoda West', 'Batadombathuduwa', 'Miriswatta', 'Wanduramulla West', 'Pinwala East', 'Pinwala West', 'Wanduramulla East', 'Mahavila', 'Pamunugama', 'Alubomulla West', 'Rambukkana North', 'Kamburugoda West', 'Kamburugoda East', 'Veedagama West', 'Gelanigama', 'Raigama South', 'Raigama West', 'Raigama East', 'Raigama North', 'Kolamediriya North', 'Bandaragama East', 'Bandaragama', 'Rambukkana South', 'Bolgoda', 'Mahabellana', 'Ibulliha', 'Diganathuduwa', 'Madupitiya', 'Mahawatta', 'Bandaragama West', 'Yatiyana', 'Wevita', 'Atulugama East', 'Panape', 'Galgemandiya', 'Atulugama West', 'Bamunumulla (Muslim)', 'Bamunumulla', 'Epitamulla', 'Korawela', 'Bogahawatta', 'Kimmanthudawa'] 
      },
      { 
        name: 'Horana', 
        gnDivisions: ['Kotigamgoda', 'Pahala Millewa North', 'Pahala Millewa South', 'Ihala Millewa North', 'Ihala Millewa South', 'Thalagala East', 'Thalagala North', 'Thalagala West', 'Olaboduwa North', 'Koralaima', 'Godigamuwa East', 'Halapitiya', 'Wellmilla', 'Godigamuwa West', 'Palannoruwa', 'Olaboduwa South', 'Olaboduwa East', 'Thalagala South', 'Pannila', 'Kahatapitiya', 'Uduwa North', 'Kidelpitiya', 'Gorokgoda', 'Dambara', 'Handupelpola', 'Kuda Uduwa', 'Maha Uduwa', 'Kananvila North', 'Batuvita North', 'Kumbuka East', 'Kumbuka South', 'Kumbuka North', 'Kumbuka West', 'Pokunuwita', 'Batuvita South', 'Meemana', 'Kananvila South', 'Uduwa South', 'Kirigalahena', 'Meewanapalana West', 'Meewanapalana East', 'Gurugoda', 'Munagama East', 'Midellamulahena', 'Ovitiyagala', 'Aramanagolla', 'Werellahena', 'Kulupana', 'Kanewala', 'Henegama', 'Galedandugoda', 'Horana North', 'Munagama West', 'Dikhenagama', 'Narthanagala', 'Horana South', 'Wewala West', 'Halthotiyawatta', 'Mahena', 'Wewala East', 'Horana East'] 
      },
      { 
        name: 'Ingiriya', 
        gnDivisions: ['Menerigama', 'Arakavila', 'Kandanapitiya', 'Kottiyawatta', 'Kurana North', 'Kurana South', 'Kotigala', 'Handapangoda East', 'Handapangoda West', 'Kekuladola', 'Handapangoda South', 'Batugampola', 'Raigamwatta', 'Maha Ingiriya', 'Nambapana', 'Urugala East', 'Ingiriya East', 'Ingiriya North', 'Nimalagama', 'Eduragala', 'Maputugala', 'Pelpitigoda', 'Rathmalgoda East', 'Rathmalgoda West', 'Poruwadanda West', 'Poruwadanda East', 'Wagawatta', 'Kekulaliya', 'Dombagaskanda', 'Ingiriya West', 'Urugala West'] 
      },
      { 
        name: 'Bulathsinhala', 
        gnDivisions: ['Ihala Naragala', 'Kobawaka North', 'Diwalakada', 'Meegahakumbura', 'Yahalawatta', 'Bothale Gangoda', 'Kongasthenna', 'Halwathura', 'Amaragedara North', 'Bothale', 'Bulathsinhala North', 'Egaloya', 'Kobawaka South', 'Ihala Naragala South', 'Govinna North', 'Pahala Naragala', 'Dewamulla', 'Govinna South', 'Ratiyala', 'Galahena', 'Bulathsinhala South', 'Bulathsinhala', 'Bulathsinhala Central', 'Amaragedara South', 'Delmella', 'Udugalakanda', 'Niggaha', 'Yatagampitiya', 'Karaldekma', 'Bulathsinhala East', 'Damparadugoda', 'Pahala Welgama', 'Bulathsinhala West', 'Deeyakaduwa East', 'Deeyakaduwa West', 'Bogahawatta', 'Mahagama North', 'Demodarawatta', 'Thennahena', 'Ihala Welgama', 'Paragoda West', 'Paragoda East', 'Molkawa', 'Galahitiya', 'Mahagama East', 'Polegoda West', 'Mahagama West', 'Pahala Kudaligama', 'Ihala Kudaligama', 'Weyangalla West', 'Weyangalla East', 'Mahagama South', 'Muduna', 'Gamagewatta'] 
      },
      { 
        name: 'Madurawala', 
        gnDivisions: ['Ilimba', 'Kandana North', 'Kandana South', 'Elawella', 'Bellapitiya West', 'Mahena South', 'Bellapitiya East', 'Walpita', 'Werawatta', 'Peramunagama', 'Weliketella', 'Remuna', 'Mahayala East', 'Kananvila', 'Mahayala West', 'Hallankanda', 'Kudella', 'Madurawala East', 'Kudayala', 'Pahala Karannagoda', 'Anguruwathota', 'Madurawala West', 'Keselhenawa', 'Karannagoda', 'Ihala Karannagoda', 'Katuhena', 'Warakagoda North', 'Warakagoda West', 'Warakagoda South', 'Warakagoda East', 'Nahalla', 'Pahalagoda', 'Ihalagoda'] 
      },
      { 
        name: 'Millaniya', 
        gnDivisions: ['Gungamuwa', 'Bellanthudawa', 'Kelesgamuwa', 'Welikala', 'Thibbotugoda', 'Lenawara', 'Haltota', 'Langana', 'Deldorawatta', 'Millaniya', 'Raddegoda', 'Delkada', 'Paragasthota', 'Dikhena', 'Arakagoda', 'Kennanthudawa', 'Mawathgama', 'Yalagala', 'Labugama', 'Pethigamuwa North', 'Pethigamuwa South', 'Weniwelpitiya', 'Millagaspola', 'Boralessa', 'Pelpola', 'Imbulahena', 'Punsiripura', 'Galpatha West', 'Galpatha East', 'Batagoda', 'Mulkadakanda', 'Adhikarigoda', 'Dombagoda', 'Uduwara North', 'Uduwara West', 'Uduwara East', 'Uduwara South', 'Pathakada', 'Panagoda', 'Yatawara South', 'Mahadurupitiya', 'Delgoda', 'Yatawara North', 'Begamuwa Thalahitiya'] 
      },
      { 
        name: 'Kalutara', 
        gnDivisions: ['Mestiya', 'Maha Gonadoowa', 'Kuda Gonadoowa', 'Moronthuduwa North', 'Mawala', 'Melegama North', 'Melegama South', 'Habaralagahalanda', 'Pohoddaramulla West', 'Pohoddaramulla East', 'Pothupitiya East', 'Mawala South', 'Maharekma', 'Nandoowa', 'Moronthuduwa South', 'Kalapugama', 'Kalapugama West', 'Ariyagama', 'Deldoowa', 'Nugagoda', 'Pothupitiya South', 'Pothupitiya North', 'Pothupitiya West', 'Meda Pothupitiya', 'Kuda Waskaduwa West', 'Kuda Waskaduwa North', 'Kuda Waskaduwa East', 'Kapuhena', 'Usgodella', 'Panapitiya North', 'Paradoowa', 'Dodammulla', 'Diyagama', 'Panapitiya South', 'Rannungala', 'Uggalbada West', 'Dediyawala', 'Kuda Waskaduwa South', 'Mahawaskaduwa South', 'Mahawaskaduwa North', 'Vilegoda North', 'Malwatta', 'Wijerathnawatta', 'Uggalbada East', 'Thekkawatta', 'Jawatta', 'Botnikwatta', 'Kaluthara North', 'Deshasthra Kalutara', 'Deshasthra Kalutara West', 'Vidyasara', 'Thotupala', 'Ethanamadala', 'Palathota', 'Welapura', 'Kalutara South', 'Kuda Heenatiyangala', 'Ilukwatta', 'Vilegoda South', 'Godaparagahahena', 'Kithulawa', 'Alwiswatta', 'Etavila', 'Akkaragoda', 'Mahawatta', 'Kalutara South A', 'Kalapuwa', 'Wettumakada', 'Kurunduwatta', 'Maha Heenatiyangala', 'Wattamulla', 'Alubogahalanda', 'Rajawatta Aluth Kotasa', 'Rajawatta Parana Kotasa', 'Pulartan', 'Uswatta', 'Katukurunda', 'Kalamulla North', 'Nagoda West', 'Kajudoowawatta', 'Nagoda South', 'Weniwelketiya', 'Gallassa', 'Kalamulla East', 'Kalamulla South', 'Ethagama West', 'Ethagama East'] 
      },
      { 
        name: 'Beruwala', 
        gnDivisions: ['Kuda Paiyagala North', 'Mehimulla', 'Pambe', 'Hirigalgodella', 'Malegoda', 'Kuda Piyagala South', 'Payagala North', 'Pinidiyamulla', 'Viharakanada', 'Palayangoda', 'Weragala', 'Katukurundugahalanda East', 'Katukurundugahalanda West', 'Pothuvila East', 'Mahagammedda', 'Maha Paiyagala', 'Pothuvila West', 'Munasinghagoda', 'Diyalagoda', 'Kapugoda', 'Halkandavila', 'Yovungama', 'Doowegoda', 'Kendagahavila', 'Munhena', 'Maggon East', 'Akkaramale', 'Maggona West', 'Idiriligoda', 'Kuda Magalkanda', 'Magalkanda North', 'Magalkanda South', 'Akkara 80', 'Bubulanda', 'Kadurugasmulla', 'Bandanagoda', 'Kalavilakanda', 'Walathara', 'Pannila', 'Cheenakatuwa', 'Akkaragoda', 'Karandagoda', 'Marakkalawatta', 'Polkotuwa', 'Paranakade', 'Maradana', 'Hettiyakanda', 'Massalgoda', 'Kankanamgoda', 'Ambepitiya', 'Pinhena', 'Pinhena Colony', 'Kalavila', 'Malewangoda', 'Padagoda', 'Hettimulla', 'Mahagoda', 'Maligahena', 'Moragalla', 'Mullapitiya', 'Gammedda', 'Kaluwamodara North', 'Galhena', 'Alakadupitiya', 'Welipitiya', 'Pathirajagoda', 'Kadiyawatta', 'Malewana', 'Adhikarigoda', 'Nakandalagoda', 'Danwattagoda', 'Kotapitiya', 'Warapitiya', 'Dharga Town East', 'Ganga Addara', 'Dharaga Town', 'Kaluwamodara East', 'Kaluwamodara West', 'Ganegama', 'Seenawatta', 'Aluthgama East', 'Aluthgama West'] 
      },
      { 
        name: 'Dodangoda', 
        gnDivisions: ['Koholana North', 'Ukwatta', 'Bolossagama', 'Remunagoda North', 'Pelapitiyagoda', 'Pelapitiyagoda North', 'Pahala Neboda', 'Neboda', 'Nebada West', 'Thebuwana East', 'Thebuwana West', 'Remunagoda South', 'Gamagoda East', 'Serupita East', 'Serupita West', 'Koholana South', 'Adhikarigoda', 'Gamagoda West', 'Bombuwala North-West', 'Bombuwala North-Central', 'Bombuwala North-East', 'Bombuwala South-West', 'Bombuwala South-Central', 'Bombuwala South-East', 'Thudugala East', 'Wellatha', 'Ihala Nebada', 'Wattahena', 'Nehinna', 'Wadugama', 'Thudugala West', 'Dodangoda East-North', 'Dodangoda West-North', 'Dodangoda West-North West', 'Dodangoda West', 'Dodangoda West-Central', 'Dodangoda West-South', 'Dodangoda East-South', 'Sapugahawatta', 'Puhambugoda East', 'Dodangoda East', 'Dodangoda East-Central', 'Puhambugoda West', 'Eladuuwa', 'Galpottavila'] 
      },
      { 
        name: 'Mathugama', 
        gnDivisions: ['Iddagoda West', 'Iddagoda East', 'Hirikatiya', 'Panthiya', 'Welimanana', 'Bopitiya East', 'Yattovita', 'Mathugama West', 'Mathugama North', 'Gurudola', 'Wettewa', 'Mathugama East', 'Mathugama South', 'Naravila', 'Bopitiya West', 'Deeyagala', 'Thambaretiya', 'Yatadolawatta East', 'Yatadolawatta West', 'Aluthgamgoda', 'Navuttuduwa', 'Keeranthidiya', 'Pussalamulla', 'Kolehekada', 'Kotagedara', 'Henegama', 'Badugama', 'Ovitigala', 'Sandasirigama', 'Badugama New Colony', 'Horawala East', 'Horawala North', 'Horawala', 'Horawala West', 'Welipenna East-South', 'Welipenna West', 'Welipenna East-North', 'Dippita', 'Lewwanduwa North', 'Henpita', 'Galmatta', 'Walagedara North', 'Warakatholla', 'Nugagahalanda', 'Keppetigahalanda', 'Bondupitiya', 'Andawala', 'Thalgasgoda', 'Indigasthuduwa', 'Ladduwa', 'Meegama', 'Dewagoda', 'Walagedara South', 'Kurudippita', 'Lewwanduwa West', 'Lewwanduwa East', 'Madawala'] 
      },
      { 
        name: 'Agalawatta', 
        gnDivisions: ['Girikola', 'Pimbura', 'Omatta', 'Omatta East', 'Evariwatta', 'Kekulandala South', 'Halovita', 'Udawela', 'Helamba', 'Yatiyana West', 'Gorokgoda', 'Beragama', 'Agalawatta', 'Kekulalandala North', 'Dapiligoda', 'Wandurabba', 'Yatiyana East', 'Pinnagoda', 'Bodhiyakanda', 'Mulatiyana', 'Ridirekhagama', 'Kithulgoda', 'Kithulgoda South', 'Kuda Kalupahana', 'Maha Kalupahana', 'Kevitiyagala North', 'Diyapattugama', 'Kurupita', 'Harankahapatha', 'Kevitiyagala', 'Polgampala', 'Polgampala East', 'Rathmale East', 'Rathmale'] 
      },
      { 
        name: 'Palindanuwara', 
        gnDivisions: ['Kosgulana', 'Kelinkanda', 'Kelinkanda Colony', 'Walakada', 'Kapugedara', 'Galahitiya', 'Ilukpatha', 'Pelenda West', 'Pelenda', 'Bampara', 'Ambegoda', 'Morapitiya North', 'Morapitiya', 'Midalana West', 'Maragahadeniya', 'Lathpandura East', 'Bellana East', 'Viharagama', 'Kapugama', 'Bellana', 'Yakupitiya', 'Lathpandura', 'Kamburawala', 'Baduraliya', 'Diggoda', 'Midalana', 'Morapitiya South', 'Athwelthota', 'Diganna', 'Batahena', 'Hedigalla', 'Magura East', 'Magura West', 'Addaragoda', 'Penigala', 'Kalugala', 'Athale', 'Ingurudaluwa', 'Bollunna', 'Kalukandawala', 'Batagodavila', 'Boralugoda', 'Thiniyawala'] 
      },
      { 
        name: 'Walallavita', 
        gnDivisions: ['Pannila South', 'Pannila East', 'Uragoda West', 'Uragoda East', 'Lihiniyawa West', 'Lihiniyawa East', 'Moragala', 'Meegahathenna', 'Malwachchigoda Gangabada', 'Borthalawa', 'Kumbadoowa', 'Maddegama', 'Bogodakanda', 'Halwalakele Malwathukanda', 'Uthumgama', 'Kuda Mathugama', 'Pareigama North', 'Halwala', 'Pannila', 'Miriswatta', 'Iththapana North', 'Malambehena', 'Iththapana West', 'Iththapana South', 'Iththapana East', 'Lulbadduwa', 'Pareigama South', 'Gulawita North', 'Wedawatta', 'Katukele Welmeegoda', 'Ranepuragoda', 'Mandagala', 'Yattapatha', 'Pahala Hewessa North', 'Pahala Hewessa South', 'Pelawatta East', 'Pelawatta', 'Pelawatta West North', 'Makalandawa', 'Makalandawa South', 'Gulavita South', 'Udugama', 'Karapagala', 'Gammana East', 'Gammana West', 'Gorakaduwa', 'Yagirala', 'Katudora', 'Magurumasvila', 'Walallawita', 'Pelawatta West South', 'Gorakadoowa', 'Miriswatta', 'Thundola', 'Weerakanda', 'Gulanawatta', 'Kankotawatta', 'Ihala Hewessa', 'Walallavita South', 'Thotaha'] 
      },
    ]
  },
  'Kandy': {
    province: 'Central',
    divisionalSecretariats: [
      { 
        name: 'Thumpane', 
        gnDivisions: ['Meegahahena South', 'Meegahahena', 'Galabawa', 'Kobbegala', 'Ambagahahena', 'Rockhill', 'Akkarawatta', 'Bonakot', 'Haddapitiya', 'Delgasyaya', 'Gallenawatta', 'Kandanhena East', 'Namalthenna', 'Alawattegama', 'Kumburegama', 'Ban Anga', 'Ethamulla', 'Palukopiwatta', 'Damunugasthenna', 'Galagedara West', 'Udapitiya', 'Galagedara Madige south', 'Galagedara', 'Galagedara Madige', 'Pethigewela', 'Udalagama', 'Gunadaha', 'Medagoda Pahala', 'Opalla', 'Gangodapitiya', 'Pubbiliya', 'Kannadeniya', 'Barandara', 'Kaluwana', 'Kinigama', 'Kinigama East', 'Poththila', 'Uduwa', 'Medagoda Ihala', 'Naranwala', 'Hikgodawalpola', 'Paranagama', 'Weththewa', 'Pavulpawa', 'Kirindiwelpola', 'Kuragama North', 'Nikathenna', 'Etambegoda', 'Thahalpitiya', 'Dehideniya', 'Kandekumbura', 'Diyapalagoda', 'Niyangoda', 'Niyambepola', 'Henegama Palkumbura', 'Idamegama', 'Marawanagoda', 'Adungama Palkumbura', 'Kuragama', 'Udahenepola', 'Poholiyadda', 'Hiyadala', 'Pallekotuwa', 'Hiyadala Walpola', 'Minigamuwa', 'Minigamuwa Ihala', 'Thennewela'] 
      },
      { 
        name: 'Poojapitiya', 
        gnDivisions: ['Egodamulla North', 'Ihalamulla', 'Dehiwatta', 'Egodamulla South', 'Pahala Kithulgolla', 'Alawatta', 'Uda Kithulgolla', 'Ankumbura South', 'Ankumbura North', 'Uggala Janapadaya', 'Pahala Pallegama', 'Welgala', 'Ankumbura Udagama', 'Kovila muduna', 'Galhinna', 'Galkanda', 'Palliya Kotuwa', 'Batagolladeniya', 'Watagalathenna', 'Morankanda', 'Wewala North', 'Udahena', 'Siyapathgama', 'Pathirada', 'Udahigulwala', 'Pahala Hingulwala', 'Rambukewala', 'Godahena', 'Kahatagasthenna', 'Watagoda', 'Dolapihilla North', 'Dolapihilla South', 'Weligalla', 'Wewala', 'Bokkawala', 'Harankahawa', 'Henegama', 'Molagoda', 'Waldeniya', 'Medagoda', 'Diddeniya', 'Ovissa North', 'Ovissa South', 'Kiralagama', 'Palipana', 'Dombagammana', 'Ukgahakumbura', 'Marathugoda North', 'Marathugoda South', 'Ambaruppa', 'Gallella', 'Maruddana', 'Alagoda', 'Madadeniya', 'Warakadeniya', 'Batagalla North', 'Bamunupola', 'Batugoda North', 'Batagalla South', 'Batugoda South', 'Diwanawatta', 'Mullegama North', 'Kahawatta North', 'Kahawatta South', 'Mullegama South', 'Kaluwana South', 'Kaluwana North'] 
      },
      { 
        name: 'Akurana', 
        gnDivisions: ['Rambuke Ela', 'Vilana Udagama', 'Vilana Pallegama', 'Walahena', 'Alawathugoda', 'Balakaduwa', 'Mawathupola', 'Arambepola', 'Delgasgoda', 'Dippitiya', 'Malwanahinna', 'Konakalagala', 'Malgamandeniya', 'Rathkoho', 'Marahela', 'Hureegolla', 'Neeralla', 'Melchena', 'Bulugohothanna', 'Kasawatta', 'Udaweliketiya', 'Pallewelikatiya', 'Dodangolla', 'Akurana', 'Delgasthenne', 'Kurugoda', 'Deegala', 'Pangollamada', 'Dunuvila North', 'Dunuvila South', 'Palledeegala', 'Telambugahawatta Gama', 'Waragashinna', 'Kurudugahaela', 'Uggala'] 
      },
      { 
        name: 'Pathadumbara', 
        gnDivisions: ['Yatawara', 'Yatawara Kandagama', 'Ihala Yatawara', 'Udurawana', 'Doragamuwa', 'Bogahakumbura', 'Deegahawathura', 'Mahakumbura', 'Mandandawela', 'Paranagama', 'Aluthgama', 'Walpaladeniya', 'Puwakgahadeniya', 'Wattegama', 'Wattegama North', 'Gunembill', 'Eriyagasthenna', 'Pitiyegedara', 'Yatirawana', 'Meegammana', 'Meegammana West', 'Galadeniya', 'Udathalavinna', 'Pallethalavinna Ihala', 'Moonamale', 'Kendaliyadda', 'Girakaduwa', 'Ambathanna', 'Molagodayawatta', 'Megodagama', 'Egodagama', 'Millanga', 'Pallethalavinna', 'Udathalavinna Madige', 'Meegamawatta', 'Madawala Madige', 'Madawala', 'Walala', 'Ketakahala', 'Thalkotuwa', 'Napana', 'Leemagahadeniya', 'Pihilladeniya', 'Gunnepana Madige', 'Polgolla', 'Balanagala', 'Nawayalathenna', 'Kahalla', 'Kalugalawatta', 'Galewatta', 'Abasingama', 'Hamindagoda'] 
      },
      { 
        name: 'Panvila', 
        gnDivisions: ['Kelebokka', 'Watakele', 'Mahapathana', 'Kosgama', 'Thawalanthenna', 'Gomaraya', 'Beddegama', 'Arattana', 'Madulkele', 'Hathale', 'Angammana', 'Udugoda', 'Pitawala', 'Panvila'] 
      },
      { 
        name: 'Udadumbara', 
        gnDivisions: ['Meemure', 'Kumbukgolla', 'Kaikawala', 'Pusse Ela', 'Karambaketiya', 'Gerandigala', 'Moonamalpelessa', 'Kalugala', 'Udailuka', 'Padupola', 'Udakumbura', 'Kalugaloya', 'Dumbaragama', 'Pallewela', 'Udawela', 'Kandegama', 'Wadawalakanda', 'Kobonilla', 'Pallekanda', 'Hanwella', 'Andideniya', 'Dambagahapitiya', 'Poppitiya', 'Oyathenna', 'Thalagune', 'Gedaramada', 'Kirigankumbura', 'Udadumbara', 'Nawanagala', 'Hunnasgiriya', 'Kiripattiya', 'Halyala', 'Mediriya', 'Gangoda', 'Udapitawala', 'Mahawala', 'Pitawala Udagammedda', 'Godakumbura', 'Mediwaka', 'Karandagolla', 'Rambukwella East', 'Rambukwella West', 'Denapitiya', 'Nugethenna East', 'Nugethenna West', 'Kevulgama', 'Ganegala', 'Minuwangamuwa', 'Kalalgamuwa', 'Pitawala', 'Dewahandiya East', 'Hapukanda East', 'Hapukanda West', 'Madugalla Udagammedda', 'Madugalla North', 'Madugalla South', 'Pamunethenna', 'Devinnegama', 'Bamgarabedda East', 'Bambarabedda West', 'Pitigoda', 'Kalawala', 'Dewahandiya West'] 
      },
      { 
        name: 'Minipe', 
        gnDivisions: ['Galamuduna', 'Dungolla', 'Thotillagasella', 'Palugolla', 'Wewere', 'Dehemigama', 'Himbutuwa', 'Udattawa North', 'Pallegaladebokka', 'Udagaladebokka', 'Udaththawa', 'Dambagahawela', 'Kindigoda North', 'Udawela', 'Kindigoda South', 'Ulpathagama', 'Ambagolla', 'Dambepitiya', 'Welgahawadiya', 'Mahayaya North', '08 Ela', 'Welgala', 'Mahayaya South', 'Thorapitiya', 'Keenapelessa', 'Mahagalahinna', 'Hasalaka', 'Pallewatta', 'Hasalaka Nagaraya', 'Mahaassedduma', 'Rathnella', 'Gurulupotha', 'Waragolla', 'Weragama', 'Bulathwelkandura', 'Weraganthota', 'Morayaya', 'Lunumadalaketiya', 'Diyabubula', 'Handaganawa', 'Batumulla', 'Udayagala', 'Asamodagamyaya', 'Ambagahapelessa', 'Muttettuthenna', 'Minipe', 'Kolonyaya', 'Bebiya'] 
      },
      { 
        name: 'Medadumbara', 
        gnDivisions: ['Elliyadda', 'Thunisgala', 'Gonawala', 'Thangappuwa', 'Kotaganga', 'Bulathwatta', 'Galabodawatta', 'Nagolla', 'Galkotuwa', 'Werapitiya', 'Werathenna', 'Randiwela', 'Bobebila', 'Duckwariya', 'Rangala Aluthwatta', 'Ferndail', 'Hakmana', 'Birnside', 'Rangala', 'Weladarada', 'Makuldeniya', 'Waradiwela', 'Giddawa-Waradiwela', 'Dunhinna', 'Maneluwa', 'Giddawa', 'Weliketiya', 'Putuhapuwa', 'Udabage', 'Amupitiya', 'Godamunna', 'Katugoda', 'Heeloya', 'Kandekumbura', 'Retiyagama', 'Poddalgoda', 'Nilgala', 'Madeniyawaka', 'Embalagama', 'Siridigana', 'Nugepathana', 'Watapana', 'Ambalagala', 'Gangasirigama', 'Madapola', 'Kandegama', 'Randeniya', 'Pallebage', 'Gabbela', 'Udispattuwa', 'Ranmulla', 'Maharawela', 'Kurukohogama', 'Kiribattalawa', 'Hathiyalwela', 'Mangoda', 'Rambukpotha', 'Namadagala', 'Metideniya', 'Doraliyadda South', 'Wegala', 'Meegahamaditta', 'Rambukwella', 'Udawela', 'Wellethota', 'Vilamuna', 'Karalliyadda', 'Ambagahalanda', 'Hijrapura', 'Galambalama', 'Maberiyathenna', 'Ellepola', 'Wewegama', 'Senarathwela', 'Nithulemada', 'Udathenna', 'Medamahanuwara', 'Bomure', 'Rajagala', 'Wathuliyadda', 'Moragahamula', 'Mahadoraliyadda', 'Puwakgahadiwela', 'Ambale', 'Meeriyagolla', 'Bambaragahadeniya', 'Meegahalanda', 'Sandasiri Dunuvila', 'Thennalanda', 'Udagammedda', 'Welapahala', 'Meda Gammedda', 'Rambukwella East'] 
      },
      { 
        name: 'Kundasale', 
        gnDivisions: ['Dunuhappawa', 'Naranpanawa West', 'Kandekumbura', 'Alawathugiriya gama', 'Galpihilla', 'Makkanigama', 'Wavinna', 'Pallegama', 'Maharathenna West', 'Udagama North', 'Ihala Gonagama', 'Delgaslanda', 'Lunuketiyamaditta', 'Naranpanawa East', 'Kuruambemuduna', 'Maluwegama', 'Wepathana', 'Gonawala North', 'Deliwalathenna', 'Heepitiya', 'Udagama South', 'Maharathenna East', 'Manikhinna', 'Hurikaduwa North', 'Hurikaduwa West', 'Bogaskumbura', 'Pilawala North', 'Amunugama North', 'Amunugama South', 'Udagunnepana South', 'Udagunnepana North', 'Gabadagama South', 'Gabadagama North', 'Pallegunnepana South', 'Pallegunnepana North', 'Sirimalwatte West', 'Sirimalwatta East', 'Sirimalwatte Pallegama', 'Lewellagama', 'Degaldoruwa', 'Deekirimadawala', 'Hapuwala', 'Galapitambe', 'Hathamuna', 'Dodamgolla', 'Hurikaduwa South', 'Hurikaduwa East', 'Hurikaduwa Madige', 'Galamuna', 'Malpana', 'Ahaspokuna North', 'Gonawala South', 'Kumbukkandura South', 'Kumbukkandura North', 'Rajawella North', 'Ahaspokuna South', 'Ihalawela', 'Kengalla', 'Nithulethenna', 'Dambarawa', 'Pilawala South', 'Mahawatta East', 'Mahawatta North', 'Mahawatta West', 'Mahawatta South', 'Arangala North', 'Karattamada', 'Arangala South', 'Galmaduwa', 'Nattarampotha', 'Kundasale North', 'Kundasale South', 'Balagolla West', 'Balagolla East', 'Aswalapitiya', 'Diyabubula', 'Rajawella South', 'Aluth Pallekele', 'Wijaya Sri Gama', 'Ambakotewatta'] 
      },
      { 
        name: 'Kandy Four Gravets & Gangawata Korale', 
        gnDivisions: ['Mawilmada', 'Siyambalagasthenna', 'Pitakanda Gama', 'Senkadagala', 'Wattaranthenna', 'Nittawela', 'Watapuluwa', 'Mahaweli Uyana', 'Watapuluwa South', 'Aruppala East', 'Aruppala West', 'Watapuluwa West', 'Mahaiyawa', 'Mapanawathura', 'Poorna Watta East', 'Poornawatta West', 'Asgiriya', 'Bahirawa Kanda', 'Nuwara Dodanwala', 'Aniwatta East', 'Katukele West', 'Katukele', 'Ihala Katukele', 'Mahanuwara', 'Lewella', 'Thalwatta', 'Boowelikada', 'Malwatta', 'Bogambara', 'Deiyannewela', 'Nagasthenna', 'Suduhumpala East', 'Suduhumpala West', 'Welata', 'Aniwatta West', 'Gatambe', 'Pahala Eriyagama', 'Godagandeniya', 'Palle Peradeniya', 'Udabowala', 'Bowala', 'Mulgampala', 'Heeressagala', 'Hanthana Place', 'Ampitiya South', 'Ampitiya North', 'Ampitiya Udagama North', 'Thennekumbura', 'Ampitiya Pallegama', 'Meddegama', 'Ampitiya Udagama South', 'Wewathenna', 'Ulpathakumbura', 'Gurudeniya West', 'Gurudeniya East', 'Maligathenna', 'Gurudeniya Dambawela', 'Lewla', 'Ketawala', 'Bowalawatta', 'Ogastawatta', 'Uda Peradeniya', 'Hindagala', 'Mahakanda'] 
      },
      { 
        name: 'Harispattuwa', 
        gnDivisions: ['Amuwandeniya', 'Doranegama', 'Ihagama', 'Medawala', 'Angoda', 'Dembaralawa', 'Bothota', 'Attaragama East', 'Attaragama', 'Gonigoda-Palkumbura', 'Gonigoda', 'Attaragama South', 'Hapugoda', 'Udabokalawela', 'Rajapihilla', 'Ulladupitiya East', 'Ulladupitiya West', 'Arambegama', 'Aladeniya', 'Hedeniy a', 'Rajasinhagama', 'Palkumbura', 'Narangoda', 'Kurundugolla', 'Viguhumpola', 'Hiriyalagammana', 'Thittapajjala', 'Thittapajjala North', 'Nugawela', 'Batuambe', 'Endaruthenna', 'Embulpure', 'Uduwawala West', 'Uduwawala North', 'Pallebokalawela', 'Ranawana West', 'Ranawana East', 'Uduwawala East', 'Senarathgama North', 'Wathuwala', 'Uyanwatta', 'Dadahogama', 'Mapamadulla', 'Malagammana', 'Ruwanpuraya', 'Kurunduwatta', 'Ihala Karanduwawala', 'Pahala Karanduwawala', 'Owathenna', 'Yahalathenna West', 'Yahalathenna Kanda', 'Kulugammana', 'Uguressapitiya', 'Senarathgama South', 'Kondadeniya', 'Etamurungagoda', 'Yatiwawala', 'Katugasthota', 'Inigala', 'Rathmale', 'Hamangoda North', 'Hamangoda South', 'Uggalla', 'Udadoolwala', 'Kurundugahamada', 'Seewaleekanda', 'Mahatenna', 'Bulathgolla', 'Yatihalagala Udagama', 'Pahala Doolwala', 'Udamulla', 'Gohagoda', 'Wegiriya', 'Polwatta', 'Madapathagama', 'Banwelgolla', 'Narangaskumbura', 'Pallemulla', 'Hal Pallegama', 'Bogahakanda', 'Yatihalagala Pallegama', 'Haloluwa', 'Kumburegedara', 'Waratenna'] 
      },
      { 
        name: 'Hatharaliyadda', 
        gnDivisions: ['Paragoda', 'Aludeniya North', 'Aludeniya South', 'Alakolamaditta', 'Amboruwa', 'Galdola', 'Polwatta Ihalagama', 'Ilpemada', 'Polwatta', 'Dunkumbura', 'Nikathenna', 'Narangaspitiya', 'Godathale', 'Kalotuwawa', 'Dedunupitiya Pahalagama', 'Damunupola', 'Pallepola', 'Welagama', 'Weligodapola', 'Hatharaliyadda', 'Kanakkarapola North', 'Mawathagama', 'Imbulethenna', 'Welivita Ihalagama North', 'Welivita Ihalagama', 'Sivurupitiya', 'Eramuduliyadda', 'Muruddeniya', 'Walpalagolla North', 'Walpalagolla East', 'Walpalagolla South', 'Welivita Pahalagama', 'Handabowa', 'Meegasthenna', 'Kanakkarapola South', 'Avulbodale', 'Lechchimimenila', 'Yaggala', 'Rangamuwa', 'Dedunupitiya Ihala', 'Ambawa', 'Dehideniya Madige', 'Pelena Pahalagama', 'Pelena', 'Kandemeeya', 'Alagalla Pahalagama', 'Alagalla Ihala', 'Mudagammana', 'Pattapola Ihalagama', 'Pattapola Pahala', 'Welivita Pahalagama South', 'Andiyathenna', 'Kolugala', 'Kolugala Pahala', 'Kithuldora', 'Aluthgama Pahala', 'Aluthgama Ihala'] 
      },
      { 
        name: 'Yatinuwara', 
        gnDivisions: ['Alagalla Watta', 'Kirimetiya Watta', 'Pahala Yatigammana', 'Yatigammana', 'Thismada', 'Kotaligoda North', 'Udawela Nadithalawa', 'Udawela Pallemaditta', 'Wathurakumbura', 'Gurugama', 'Dehianga North', 'Kobbekaduwa', 'Ihala Kobbekaduwa', 'Pelawa Ihalagama', 'Yahalathenna', 'Pelawa Ihala Meda', 'Pelawa Pahalagama', 'Gannoruwa West', 'Dehigama East', 'Dehigama South', 'Dehigama North', 'Dehianga South', 'Pahala Dodamwala', 'Ihala Dodamwala', 'Udawela Pahalagama', 'Munwathugoda', 'Walgampaya', 'Bathgoda', 'Doluwa East', 'Doluwa West', 'Kotaligoda South', 'Menikdiwela', 'Pottepitiya', 'Ihala Alagalla', 'Godigamuwa', 'Motana Dekinda', 'Gondeniya', 'Madiligama', 'Udarathmeewala', 'Pahala Rathmeewala', 'Deldeniya', 'Walgowwagoda', 'Kavudupana', 'Haliyadda', 'Danthure', 'Siyambalagoda', 'Parakatawella', 'Imbulmalgama', 'Diyapalagoda', 'Mangalagama', 'Karuwalawatta', 'Gannoruwa Central', 'Dehideniya West', 'Sooriyagoda', 'Malgammana', 'Moladanda', 'Giragama', 'Aranbegama East', 'Kudaoya', 'Kurunduwatta', 'Kandangama North', 'Mamudawala', 'Maligathenna', 'Ketakumbura', 'Amunupura', 'Moragolla Mahakanda', 'Balana', 'Weralugolla', 'Pahala Mudaliwatta', 'Mudaliwatta', 'Panabokka', 'Kandangama South', 'Kotabogoda', 'Urapola', 'Arambegama West', 'Embilmeegama North', 'Ranawana', 'Bulumulla', 'Pilapitiya', 'Kiribathkumbura East', 'Dehideniya East', 'Kendakaduwa', 'Gannoruwa East', 'Uda Eriyagama East', 'Uda Eriyagama West', 'Edanduwawa East', 'Edanduwawa West', 'Kiribathkumbura West', 'Embilmeegama South', 'Govindala', 'Pilimathalawa', 'Ilukwatta', 'Madarangoda', 'Kadawathgama', 'Kadugannawa Town'] 
      },
      { 
        name: 'Udunuwara', 
        gnDivisions: ['Gangoda', 'Gangoda North', 'Werellamana', 'Thalawaththa', 'Boyagama', 'Gangoda South', 'Gadaladeniya North', 'Kiriwavula East', 'Kiriwavula West', 'Aladuwaka', 'Pahala Kurukuttla', 'Kurukuttala Ihala', 'Belungala', 'Lagamuwa', 'Mathgamuwa', 'Urulewaththa', 'Warakagoda', 'Hepana', 'Gadaladeniya South', 'Deliwala', 'Pamunuwa West', 'Pamunuwa East', 'Mampitiya', 'Rajagiriya', 'Hendeniya West', 'Hendeniya East', 'Penideniya', 'Sangabogama', 'Meewathura', 'Angunawala East', 'Angunawala West', 'Yalegoda East', 'Yalegoda West', 'Alapalawala East', 'Alapalawala West', 'Walgama', 'Rabbegamuwa North', 'Rabbegamuwa South', 'Hiddavulla East', 'Ganguldeniya', 'Wattappola', 'Walagedara North', 'Udagama', 'Aluthkanda', 'Sadikkawatta', 'Kovilakanda', 'Walagedara South', 'Nikahetiya', 'Panabokka', 'Hiddavulla West', 'Hiyarapitiya', 'Heeyawala', 'Imbuldeniya', 'Naranwala', 'Handessa', 'Piligalla West', 'Piligalla East', 'Godapola West', 'Godapola East', 'Kamburadeniya', 'Meewaladeniya', 'Arattana', 'Davulagala', 'Arawwawela', 'Rangama', 'Wathupola', 'Manikkawa', 'Elpitikanda', 'Kooradeniya', 'Ambanwala', 'Werawala East', 'Werawala West', 'Siyambalagoda', 'Meddegoda', 'Embakka', 'Ambarapola', 'Eladhetta West', 'Ihala Pethiyagoda', 'Pethiyagoda West', 'Pethiyagoda East', 'Palle Aludeniya', 'Karamada North', 'New Peradeniya', 'Karamada South', 'New Elpitiya North', 'Gelioya', 'Dehipagoda West', 'Dehipagoda East', 'Eladhetta East', 'Hathnagoda', 'Ketakumbura', 'Boowelikada', 'Dodandeniya', 'Batupitiya', 'Bambaradeniya', 'Pilapitiya', 'Rangoda', 'Ambagasthenna', 'Welamboda', 'Liyangahawaththa', 'Maweekumbura North', 'Maveekumbura South', 'Watadeniya', 'Viharagama', 'Ganhatha', 'Daskara', 'Wegiriya East', 'Thalawathura', 'Muruthagahamula', 'Pitawalawatta', 'New Elpitiya South', 'Polgahaanga', 'Delgahapitiya', 'Weligalla', 'Uda Aludeniya', 'Palkumbura', 'Lunugama', 'Hondiyadeniya', 'Wegiriya West', 'Kotagaloluwa', 'Deldeniya', 'Dihitideniya', 'Appallagoda East', 'Appallagoda West'] 
      },
      { 
        name: 'Doluwa', 
        gnDivisions: ['Galoya', 'Haloya', 'Wariyagala', 'Megoda Kalugamuwa', 'Ganegoda', 'Godawela', 'Nawa Gurukele', 'Nillamba', 'Nawa Nillamba', 'Palledelthota', 'Gurukele', 'Legumdeniya', 'Orayanwatta', 'Doluwa', 'Inguruwatta', 'Naranvita', 'Atuwewatta', 'Gampolawatta', 'Wewathenna', 'Thundeniya', 'Kahawatta', 'Gothatuwela', 'Millagahamula', 'Pambadeniya', 'Panvilathenna', 'Masgolla', 'Thumpelawaka', 'Mulgama', 'Ududeniya', 'Hunugala', 'Rajathalawa', 'Pupuressa', 'Pitawala'] 
      },
      { 
        name: 'Pathahewaheta', 
        gnDivisions: ['Udawelawatta Colony', 'Galthenna', 'Wathuliyadda', 'Monarangala', 'Nehiniwela', 'Godompitiya', 'Hippola', 'Kossinna', 'Thalathuoya West', 'Pussathenna', 'Pinnagolla', 'Sigharagama', 'Haragama', 'Kapuliyadda East', 'Kapuliyadda West', 'Doolmure', 'Bootawatta North', 'Thalathuoya East', 'Ankelipitiya', 'Batagalla', 'Ethulgama East', 'Ethulgama North', 'Uduwela Pallegama East', 'Udawela Pallegama West', 'Uduwela Pallegama South', 'Uduwela Udagama West', 'Uduwela Udagama East', 'Ratemulla', 'Pooliyadda', 'Ethulgama West', 'Ethulgama South', 'Haputhale Egodagama', 'Haputhale Udagama', 'Moragolla', 'Haputhale Pallegama', 'Nugaliyadda Ihala', 'Nugaliyadda Pahala', 'Bootawatta South', 'Godamunna West', 'Narangasthenna', 'Godalawela', 'Bolepa', 'Pathamailapitiya South', 'Pathamailapitiya North', 'Udamailapitiya North', 'Damunugolla', 'Marassana', 'Medadeniya', 'Welegama', 'Godamunna East', 'Letiyagolla', 'Sriyagama', 'Medagama Udagama', 'Medagama Pallegama', 'Kandewela', 'Elikewela', 'Meeruppa', 'Kethigannawela', 'Udamailapitiya South', 'Galagoda', 'Hewavissa East', 'Hewavissa West', 'Bawlana', 'Oluwawatta', 'Kiriwanagoda', 'Ududeniya Madihe', 'Unuvinna East', 'Unuvinna West', 'Ududeniya', 'Bopitiya', 'Pothgoda', 'Kahambiliyawa', 'Nilawala'] 
      },
      { 
        name: 'Deltota', 
        gnDivisions: ['Perawatta West', 'Perawatta East', 'Palugama', 'Udadelthota', 'Galaha', 'Suduwella', 'Greatweliya', 'Bawlanawatta Janapadaya', 'Maussawa', 'Wanahapuwa', 'Bopitiya Nagaraya', 'Medakekila', 'Karagaskada South', 'Karagaskada North', 'Gonangoda', 'Kandegama', 'Watakepotha', 'Pattiyagama Pallegama', 'Kirawanaketiya', 'Kolambissa West', 'Murapola West', 'Murapola East', 'Kolambissa East', 'Nawaneliya', 'Kotagepitiya', 'Wadiyagoda', 'Pattiyagama Udagama', 'Pattiyagama Gabadama North', 'Pattiyagama Gabadama South'] 
      },
      { 
        name: 'Udapalatha', 
        gnDivisions: ['Egoda Kalugamuwa', 'Udovita', 'Kirinda', 'Galgediyawa', 'Ranawala', 'Bowala', 'Rathmalkaduwa', 'Hapugaspitiya', 'Unambuwa', 'Ilangawatta', 'Kahatapitiya', 'Bothalapitiya', 'Gampola East', 'Mount Temple', 'Keerapane', 'Sinhapitiya North', 'Sinhapitiya South', 'Gampola West', 'Polkumbura', 'Illawathura', 'Angammana East', 'Angammana West', 'Eragoda', 'Kurukude', 'Kudamake', 'Godagama', 'Jayamalapuraya', 'Amunupuraya', 'Wattehena', 'Millagaspitiya', 'Udagama', 'Hunukotugama', 'Dunukeulla', 'Wanahapuwa', 'Ihalagama', 'Paradeka', 'Amuhena', 'Delpitiya', 'Nawa Devita', 'Galatha', 'Pallegama', 'Pussellawa', 'Wahugapitiya', 'Pussellawagama', 'Doragala', 'Kekulanda', 'Weliganga', 'Kalugalhinna', 'Mawathura'] 
      },
      { 
        name: 'Ganga Ihala Korale', 
        gnDivisions: ['Kohowala', 'Polmalagama', 'Galpaya', 'Herakola', 'Wallahagoda', 'Maligapurana', 'Gampolawela', 'Ethgala North', 'Thembiligala', 'Pellapitiya North', 'Mallwattagama', 'Giraulla', 'Karagala', 'Watakedeniya', 'Uduwella', 'Patithalawa', 'Kelly Group', 'Alugolla', 'Gamunupura', 'Yatapana', 'Pellapitiya South', 'Ulapane North', 'Udagama', 'Ethgala West', 'Ethgala East', 'Sinhapura', 'Ulapane South', 'Pitakanda', 'Udahenthenna', 'Rakshawa', 'Miyanagolla'] 
      },
      { 
        name: 'Pasbage Korale', 
        gnDivisions: ['Pallegama', 'Warakawa', 'Weligodawatta', 'Dandubendiruppa', 'Penithuduwa', 'Phala Rambukpitiya', 'Uda Rambukpitiya', 'Balanthota north', 'Weligampala', 'Karahandungala', 'Nawalapitiya South', 'Nawalapitiya North', 'Nawalapitiya West', 'Nawalapitiya East', 'Imbulpitiya', 'Greenwood', 'Bawwagama', 'Kendopitiya', 'Aluthgama', 'Balanthota South', 'Dekinda', 'Mapakanda North', 'Inguruoya North', 'Kadiyanlena', 'Westhole', 'Inguruoya South', 'Mapakanda South', 'Wewegama', 'Hydry'] 
      },
    ]
  },
  'Matale': {
    province: 'Central',
    divisionalSecretariats: [
      { 
        name: 'Galewela', 
        gnDivisions: ['Wetakoluwewa', 'Dewahuwa Janapadaya 2', 'Makulgaswewa', 'Ibbankatuwa', 'Thalakiriyagama', 'Thennakoonpura', 'Dandubendiruppa', 'Dewahuwa Janapadaya 1', 'Bulanawewa', 'Pahala Diggala', 'Meewalapathaha', 'Pahalawewa', 'Yatigalpotta', 'Kumbukgolla', 'Kosgahahinna', 'Ralalerotawewa', 'Moragolla', 'Pibidunugama', 'Aluthwewa', 'Bambaragaswewa', 'Beliyakanda', 'Silwathgama', 'Walaswewa', 'Galapamula', 'Damunumulla', 'Pattiwela', 'Nilagama', 'Hombawa', 'Palu Hombawa', 'Dambawatawana', 'Puwakpitiya', 'Weragalawatte', 'Namadagahawatte', 'Galewela Town', 'Pathkolagolla', 'Kospotha', 'Ranwediyawa', 'Pahala Bambawa', 'Danduyaya', 'Dambagolla', 'Ihala Bambawa', 'Siyambalagahawela', 'Pihillayaya', 'Medabedda North', 'Divulgaskotuwa', 'Hathadukkuwa', 'Beligamuwa', 'Medabedda South', 'Wahakotte', 'Galgodayaya', 'Palapathwala', 'Dembawa', 'Elamalpotha', 'Yatiwahara', 'Lenawala', 'Hewanewela', 'Wegodapola', 'Kendangamuwa', 'Madipola'] 
      },
      { 
        name: 'Dambulla', 
        gnDivisions: ['Siyambalawewa', 'Avudangawa', 'Gedigaswalana', 'Pidurangala', 'Thalkote', 'Digampathaha', 'Inamaluwa', 'Nagalawewa', 'Pothana', 'Kimbissa', 'Egodawewa', 'Palutawa', 'Sigiriya', 'Mailattawa', 'Polattawa', 'Nikawatawana', 'Kumbukkandanwala', 'Bellanneoya', 'Rathmalkatuwa', 'Welihena', 'Etawarahena', 'Pallegama', 'Bulagala', 'Pelwehera', 'Kandalama', 'Pahala Erevula', 'Ihala Erevula', 'Welangolla', 'Wewalawewa', 'Yakkuragala North', 'Vilhatha', 'Athuparayaya', 'Pahalawewa', 'Dambulla Town', 'Dambulugama', 'Haluapullanawewa', 'Pohoranwewa', 'Yapagama', 'Rathmalgaha-Ela', 'Yakkuragala South', 'Kalundewa Aluthgama', 'Angunawelpelessa', 'Kalogaha-Ela', 'Thittawelgolla', 'Moragollewa', 'Kapuwatta', 'Kiralagolla', 'Wavulambe', 'Embulambe', 'Puwakattawala', 'Kalundewa Paranagama', 'Walgamwewa', 'Kiralessa', 'Pannampitiya', 'Welamitiyawa', 'Ethabandiwewa', 'Lenadora North', 'Lenadora South', 'Nayakumbura'] 
      },
      { 
        name: 'Naula', 
        gnDivisions: ['Ussattawa', 'Nikula', 'Serudandapola', 'Haduwa', 'Bambaragahawatta', 'Dambagolla', 'Helambagaha Watta', 'Pubbiliya', 'Maragamuwa', 'Haduwela', 'Dodamattawela', 'Karawila Hena', 'Boballa', 'Bibila', 'Murutholuwa', 'Mailpitiya', 'Wewattawa', 'Penalaboda', 'Naula', 'Meegaha Ela', 'Bowathenna Watta', 'Koombiyangaha Ela', 'Millagahamula Thenna', 'Koongahawela', 'Rajawela', 'Ganimayaya', 'Moragahamada', 'Pilihudugolla Pahalagama', 'Pilihudugolla Ihalagama', 'Arangala', 'Habaragahamada', 'Elhena', 'Deeyankaduwa', 'Alugolla', 'Nalanda', 'Wambatuyaya', 'Meegolla', 'Ududeniya', 'Hapugasyaya', 'Lihinipitiya', 'Senagama', 'Andawala', 'Opalgala', 'Ambana', 'Moragolla', 'Galboda'] 
      },
      { 
        name: 'Pallepola', 
        gnDivisions: ['Janakagama', 'Nilannoruwa Janapathaya', 'Aluthgama', 'Demada Oya', 'Mananwatta', 'Nilannoruwa', 'Thalakiriyawa', 'Kirioruwa', 'Kosgolla', 'Nagahapola', 'Bomeruwa', 'Kobbewehera', 'Millawana Pahalagama', 'Millawana Medhagama', 'Kandewatta', 'Mahayayawatta', 'Medalanda', 'Walmoruwa', 'Moragaspitiya', 'Akuramboda', 'Dewarammulla', 'Millawana Ihalagama', 'Ambokka', 'Maningamuwa West', 'Maningamuwa East', 'Koswatta', 'Ekamuthugama', 'Ambokudena', 'Koholanwela', 'Udurampelassa', 'Ehelepola', 'Pallepola North', 'Monaruwila', 'Galahitiyagama', 'Rusigama Ihalagama', 'Rusigama Pahalagama', 'Pallepola South', 'Kinigama', 'Paldeniya', 'Dodamgasyaya', 'Ariyagama', 'Polwatta', 'Thembilideniya North', 'Dimbulgamuwa'] 
      },
      { 
        name: 'Yatawatta', 
        gnDivisions: ['Udagama West', 'Selagama', 'Selagama East', 'Thembilideniya', 'North Matale', 'Kawudupelella', 'Mahawela', 'Mahawela West', 'Delgolla', 'Galagama', 'Nagolla', 'Udagama', 'Urulewatta', 'Yatawatta', 'Mediyapola', 'Nikagolla', 'Nikagolla North', 'Dikkumbura West', 'Rathalawewa', 'Dikkumbura', 'Wattegedara', 'Galaliyadda', 'Muruthawatta', 'Deevilla South', 'Deevilla', 'Dungan Place', 'Alokagama', 'Walpola', 'Maligathenna', 'Aluthwatta', 'Ambanpola', 'Lakshahena', 'Deevilla North', 'Gammulla', 'Mottuwela', 'Idangama', 'Udasgiriya', 'Ethipallawala', 'Aluthgama North', 'Aluthgama', 'Pamunuwa', 'Walawela', 'Unaweruwa', 'Madadeniya', 'Mathalapitiya', 'Mathalapitiya South', 'Rathninda', 'Asgiri Dorakumbura', 'Asgiri Dorakumbura East', 'Polwatta', 'Dullewa', 'Dullewa East', 'Thalgahagoda', 'Daluwela', 'Ethipola', 'Ethipola West'] 
      },
      { 
        name: 'Matale', 
        gnDivisions: ['Narangamuwa', 'Madawala Ulpatha', 'Thalagasyaya', 'Madawala', 'Rajjammana', 'Moragahamada', 'Hathamunagala', 'Ankanda', 'Puwakpitiya', 'Walliwela', 'Galwadukumbura', 'Dombawela', 'Kawatayamuna', 'Eriyagolla', 'Imbulandanda', 'Golahenwatta', 'Parana Dombawela', 'Ellepola', 'Palapathwela', 'Kottagoda', 'Owalapolwatta', 'Mekulgaharuppa', 'Udugama', 'Kirigalpotta', 'Dunkalawatta', 'Dorakumbura', 'Beeridewala', 'Aluvihare', 'Dikkiriya', 'Parawatta', 'Kaludewala', 'Mandandawala', 'Bogahakotuwa', 'Harasgama', 'Kandegedara', 'Malwatta', 'Vihara Road', 'Muslim Town', 'Oya Pahala', 'Gongawala', 'Sinhala Town', 'Dodamdeniya', 'Hulangamuwa South', 'Hulangamuwa North', 'Diyabubula', 'Maligatenna', 'Nagolla', 'Pandivita', 'Pandivita Welagama', 'Kotuwegedara North', 'Koombiyangoda', 'Kotuwegedara South'] 
      },
      { 
        name: 'Ambanganga Korale', 
        gnDivisions: ['Kumbaloluwa', 'Gammaduwa', 'Kalugalthenna', 'Naguliyadda', 'Kosgolla', 'Imbulgolla', 'Ranmuthugama', 'Raithalawa', 'Tibbatukanatha', 'Palle Aswedduma', 'Pallethenna', 'Pussella', 'Sirangahawatta', 'Kaudagammana', 'Narangolla', 'Hunukete', 'Metihakka', 'Aluthwela', 'Cloda', 'Gurubabila'] 
      },
      { 
        name: 'Laggala-Pallegama', 
        gnDivisions: ['Maoya', 'Kandepitawala', 'Dewaladeniya', 'Kaluganga', 'Akarahediya', 'Hattota Amuna', 'Dasgiriya', 'Morathenna', 'Wellewala', 'Weliwaranagolla', 'Leloya', 'Pottatawela', 'Dammanthenna', 'Gangalapuwakpitiya', 'Divulgaspathana', 'Pitawala', 'Kahagala', 'Ilukkumbura', 'Mahalakotuwa', 'Ganga Henwala', 'Karandamulla', 'Gonawala', 'Laggala Pallegama', 'Miniranketiya', 'Rawanagama', 'Galgedawala', 'Guruwela', 'Kivulewadiya', 'Halminiya', 'Imaduwa', 'Rambukoluwa', 'Meda Ela', 'Rathninda', 'Etanwala', 'Ranamuregama', 'Narangamuwa', 'Lakegala'] 
      },
      { 
        name: 'Wilgamuwa', 
        gnDivisions: ['Kumbukoya', 'Thunhiriyawewa', 'Palupitiya', 'Rattotayaya', 'Dunuvilapitiya', 'Medakanda', 'Aliwanguwa', 'Viharagama', 'Handungamuwa', 'Topwalapitiya', 'Gemburuoya', 'Kumbukandana', 'Lediyangala', 'Karawgahawewa', 'Radunnewewa', 'Maraka', 'Malgammana', 'Bogahawewa', 'Aliyawala', 'Weheragala', 'Himbiliyakada', 'Hettipola', 'Naminioya', 'Dewagiriya', 'Piduruella', 'Guruwelayaya', 'Naminigama', 'Perakanatta', 'Wilgamuwa', 'Wanarawa', 'Bathgampala', 'Nagolla', 'Moragaha Ulpatha', 'Nugagolla', 'Meewaobe', '80 Yaya', 'Sonutta', 'Uduwelwala', 'Sulugune'] 
      },
      { 
        name: 'Rattota', 
        gnDivisions: ['Ikirigolla', 'Pahala Owala', 'Ihala Owala', 'Kaikawala', 'Nikawella', 'Kuruwawa', 'Rattota', 'Bodhikotuwa', 'Dankanda', 'Kirimetiyawe', 'Polwattakanda', 'Dambagolla', 'Medawetta', 'Weralugasthenna', 'Madakumbura', 'Maussagolla', 'Wanaraniya', 'Lonvil', 'Maradurawala', 'Pallegama', 'Koswana North', 'Palle Weragama', 'Viharagama', 'Kaineka', 'Uda Weragama', 'Meda Weragama', 'Koswana South', 'Bogambara', 'Galekoluwa', 'Welangahawatta', 'Horagolla', 'Bambarakiriella', 'Alakolamada', 'Udagama', 'Pitakanda', 'Gansarapola', 'Epitamulla', 'Wetasyaya', 'Godapola', 'Ulpathapitiya', 'Bandarapola', 'Muwandeniya', 'Palleyaya', 'Neluwakanda', 'Punchiseluwakanda', 'Thambalegala', 'Kandenuwara West', 'Kandenuwara East', 'Alwatta', 'Warapitiya', 'Dombagoda', 'Pahala Hapuvida', 'Uda Hapuvida', 'Hangarankanda'] 
      },
      { 
        name: 'Ukuwela', 
        gnDivisions: ['Galaudahena', 'Makulemada', 'Pathingolla', 'Wademada', 'Wattegedara', 'Watagoda', 'Pallekumbura', 'Katuattamada', 'Panwatta', 'Alawathuwala', 'Horagahapitiya', 'Ovilikanda', 'Kirimatiyawa', 'Thanna', 'Muwagala', 'Ovilla', 'Enasalmada', 'Thibbatuwawa', 'Dombagasdeniya', 'Kandagolla', 'Kohombiliwela', 'Wariyapola Watta', 'Wariyapola', 'Pananthadiya', 'Nawarathnagoda', 'Eriyagolla', 'Katudeniya', 'Elwala', 'Pahalawela', 'Dehipitiya', 'Purijjala', 'Udupihilla', 'Halangoda', 'Nagahatenna', 'Warakamura', 'Meedeniya', 'Nagolla', 'Thawalankoya', 'Dumbukola', 'Ukuwela', 'Udupitiya', 'Kalalpitiya', 'Balakaduwa', 'Bowatta', 'Manaboda', 'Paragahawela', 'Udathenna', 'Hunuketawala', 'Leliambe', 'Elkaduwa Watta', 'Elkaduwa', 'Udangamuwa', 'Kendagollamada', 'Wehigala', 'Rathwatta', 'Weligala', 'Kuriwela', 'Maberiya', 'Marukona', 'Gurulawela South', 'Gurulawela North', 'Nugapitiya', 'Kandemada', 'Ulpathapitiya', 'Raithalawela', 'Kaduwela', 'Poojagoda', 'Pahala Wehigala', 'Thalingamada', 'Hunnasgiriyawatta', 'Karagahahinna', 'Imbulpitiya', 'Rangama'] 
      },
    ]
  },
  'Nuwara Eliya': {
    province: 'Central',
    divisionalSecretariats: [
      { 
        name: 'Kothmale', 
        gnDivisions: ['Nawamorape', 'Nawa Kadadora', 'Delta Gemunupura', 'Helboda', 'Karagasthalawa', 'Protoft', 'Ramboda', 'Sangilipalama', 'Panamgammana', 'Katukithula', 'Helsirigama', 'Kothmalgama', 'Raja Ela', 'Mawela East', 'Mawela West', 'Maswela', 'Mawela Kanda', 'Gomburuoya', 'Wewahinna', 'Delunthalamada', 'Ambathalawa', 'Malhewa', 'Rambodagama', 'Wedamulla', 'Palagolla', 'Niyamgamdora', 'Kiridiwela', 'Kumbaloluwa', 'Medakanda', 'Egodawela', 'Pundaluoya North', 'Labukele', 'Kudaoya', 'Saman Eliya', 'Kikiliyamana', 'Dansinan', 'Sheen', 'Sheengama', 'Pundaluoya South', 'Kadadorapitiya', 'Kosgaha Pathana', 'Karagahayatathenna', 'Bogahawela', 'Halpola', 'Madakumbura', 'Dunukedeniya', 'Medakumbura North'] 
      },
      { 
        name: 'Kothmale (West)', 
        gnDivisions: ['Ranwanthalawa', 'Kadadora', 'Kotagepitiya South', 'Kotagepitiya North', 'Nayapana', 'Hapugasthalawa', 'Doruwadeniya', 'Kolapathana', 'Ruwanpura', 'Dambagolla', 'Kaludemada', 'Mallanda', 'Kataboola', 'Hunugalloya', 'Thelissagala', 'Ihala Gorakaoya', 'Polwathura', 'Pahala Gorakaoya', 'Queensberry', 'Harangala', 'Harangala South', 'Kirimetiyawa', 'Halgolla', 'Werella Pathana', 'Thispanekanda', 'Godamadiththa', 'Katugolla', 'Wataddara', 'Nawangama', 'Kalapitiya East', 'Hedunuwewe', 'Rojasangama North', 'Kalapitiya West', 'Rojasangama South', 'Wethalawa', 'Koththunugoda', 'Weerasekarapura', 'Dombagasthalawa', 'Meathagama', 'Maldeniya', 'Katarandana', 'Rawanagoda East', 'Vijayabahu Kanda', 'Beramana', 'Beramana South', 'Beramana North', 'Rawanagoda West', 'Udagammedda', 'Weerapura'] 
      },
      { 
        name: 'Hanguranketha', 
        gnDivisions: ['Hingurukaduwa', 'Ambewela', 'Welikada', 'Idamalanda', 'Adikarigama', 'Karalliyedda', 'Bogahalanda', 'Hakuruthale', 'Maliyadda', 'Mirahampe', 'Pussalamankada', 'Yati Hanguranketha', 'Delgahapitiya', 'Sangaraja Gama', 'Mudunapita', 'Gangaudagama', 'Mallulla', 'Udawatta East', 'Hilpankandura', 'Galauda North', 'Endiribedda', 'Galauda South', 'Udakanda', 'Udawatta West', 'Udawatta Kumbura', 'Pallemaluwa', 'Hanguranketha', 'Damunumeya North', 'Arattana', 'Ambaliyedda', 'Dampola', 'Rekitipe', 'Hapuwala', 'Dolugala', 'Daliwala', 'Madanwala', 'Damunumeya', 'Kottala', 'Diya - Udagama', 'Uda Galauda', 'Dodamkumbura', 'Walalawela', 'Rathmetiya', 'Hapugasdeniya', 'Diggalpotta', 'Unanthenna', 'Kosgahan Debala', 'Warapitiya', 'Medagama', 'Bowala', 'Kithulpe', 'Makempe', 'Puranagama', 'Ekiriya', 'Poramadulla', 'Labuhena', 'Rikillagaskada', 'Udamakuruppa', 'Dimbulkumbura', 'Bulugahapitiya', 'Wegama', 'Agappala', 'Bambaragama', 'Bambaragama East', 'Bambaragama West', 'Malanwatta', 'Ganga Udagama', 'Gedereiyawa', 'Daraoya', 'Kirimetiya', 'Hope', 'Watesthenna', 'Handawalapitiya', 'Karamidula', 'Madumana', 'Rahathungoda', 'Enasal Arawa', 'Kawatayamana', 'Rukwood Estate', 'Muloya', 'Udagama', 'Gannawa Udagama'] 
      },
      { 
        name: 'Mathurata', 
        gnDivisions: ['Wadawala', 'Alawattegama', 'Kaluattanagolla', 'Dehipe', 'Bodhimalkada', 'Deniyagama', 'Red Cross Gama', 'Welapahala', 'Denike', 'Udalumada', 'Welampagoda', 'Udawela Pathana', 'Wilwala', 'Ehelamalpe', 'Pallewela', 'Bogamuwa', 'Makuruppa', 'Palle Mukuruppa', 'Bodhiwela', 'Illagolla', 'Moragolla', 'Rammalakandura', 'Happawara', 'Ketayapathana', 'Dunukebedda', 'Gonakele', 'Ketayapathana Udagama', 'Ampitigoda', 'Bomellagoda', 'Gonapitiya', 'Mathurata', 'Merrygold', 'Idampitiya', 'Uda Padiyapelella', 'Okandagala', 'Manakola', 'Deegalahinna', 'Marthuwela', 'Rathyaya', 'Godigamuwa', 'Elamulla', 'Ketahira', 'Wellagiriya', 'Metibembiya', 'Mandaramnuwara', 'Goodwood', 'Udawela', 'Labuhenwala', 'Wewathenna', 'Medawela', 'Malsaranuwara', 'Hunukotuwa'] 
      },
      { 
        name: 'Walapane', 
        gnDivisions: ['Sarasunthenna', 'Ketakandura', 'Batagolla', 'Thennehenwala', 'Deliwala South', 'Deliwala North', 'Pannala', 'Serupitiya', 'Mailagasthenna', 'Andawela', 'Naranthalawa', 'Ihala Pannala', 'Wewakele', 'Kumbalgamuwa', 'Kumbalgamuwa East', 'Mulhalkele', 'Manelwala', 'Wathumulla', 'Kendagolla', 'Egoda Kanda', 'Kandegama', 'Walapane', 'Kurunduoya', 'Liyanwala Ihalagama', 'Madumana', 'Ilukpelessa', 'Unagolla', 'Liyanwala Pahalagama', 'Medakandura', 'Galabada', 'Ambagaspitiya', 'Munwatta', 'Landupita', 'Wetekgama', 'Padiyapelella', 'Napatawela', 'Ukuthule', 'Yatiwella', 'Wetagepatha', 'Ukuthule East', 'Alakola Wewa', 'Highforest watta', 'Mahakudugala', 'Brookside', 'Highforest', 'Binganthalawa', 'Maha Uva', 'Werella Pathana', 'Morabedda', 'Harasbedda North', 'Mahapathana', 'Harasbedda South', 'Palalpathana', 'Rathnayakapura', 'Ragala Watta', 'Manthreethenna', 'Pandithaya Kumbura', 'Senarathpura', 'St. Leonard', 'Ragala', 'Ekangapura', 'Samagipura'] 
      },
      { 
        name: 'Nildandahinna', 
        gnDivisions: ['Thibbotugoda', 'Watambe', 'Thibbatugoda South', 'Rambuke', 'Arampitiya', 'Udamadura', 'Kosgolla', 'Udamadura North', 'Galkadawela', 'Kalagamwatta', 'Udawela', 'Yobuwelthenna', 'Galketiwela', 'Hapugahapitiya', 'Morangathenna', 'Ellakumbura', 'Mugunagahapitiya', 'Bolagandawela', 'Hegasulla', 'Ambagahathenna', 'Higuruwela', 'Mallagama', 'Dulana', 'Helagama', 'Yatimadura', 'Thunhitiyawa', 'Demataarawa', 'Ambanella', 'Hegama', 'Wewathenna', 'Denabure', 'Dambagolla', 'Gorandiyagolla', 'Purankumbura', 'Dabbare', 'Nildandaheenna', 'Kumbukwela', 'Udagama', 'Karandagolla', 'Kotambe', 'Madulla', 'Madulla South', 'Morahela', 'Kandeyaya', 'Roopaha', 'Pallewela', 'Palugama', 'Maliyadda', 'Meepanawa', 'Roopaha East', 'Mathetilla', 'Kurupanawela', 'Wathulanda East', 'Wathulanda West', 'Ambaliyadda', 'Embulanpaha', 'Udapussellawa North', 'Udapussellawa South', 'Sooriyagahapathana Pahala', 'Sooriyagahapathana Ihala', 'Galkadapathana', 'St. Magret', 'Delmar'] 
      },
      { 
        name: 'Nuwara Eliya', 
        gnDivisions: ['Bangalahatha', 'Toppass', 'Park', 'Concordia', 'Kandapola', 'Kandapola Central', 'Hawaeliya East', 'Bambarakele', 'Nuwaraeliya West', 'Shanthipura', 'Kalapura', 'Rathnagiriya', 'Summerset', 'Nanuoya', 'Windicorner', 'Nuwaraeliya', 'Nuwaraeliya Central', 'Hawaeliya North', 'Hawaeliya West', 'Bulu Ela', 'Galpalama', 'Jayalanka', 'Kandapola East', 'Pedro', 'Goradihela', 'Seethaeliya', 'Sandathenna', 'Kelegala', 'Kalukele', 'Magasthota', 'Ruwaneliya', 'Perakumpura', 'Kirimetiya', 'Magoda', 'Mihindupura', 'Meepilimana', 'Ambewela', 'Pattipola'] 
      },
      { 
        name: 'Thalawakale', 
        gnDivisions: ['Lindula', 'Hallbrook', 'Elbedda', 'Agarapathana', 'Dayagama West', 'Nagasena', 'Eildonhall', 'Rahanwatta', 'Waltrim', 'Glasgow', 'Albian', 'Lippakelle', 'Thangakele', 'Henfold', 'Braemore', 'Balmoral', 'Sandrinhem', 'Dayagama East', 'Weverly', 'Kotagala', 'Kudu Oya', 'Dimbula', 'Devon', 'Watagoda', 'Thalawakele', 'Stonycliff', 'Dreton', 'Bogahawatta', 'Mount Vernon', 'Coombewood', 'Hollyrood', 'Bearwell', 'Yulefield', 'Great Western'] 
      },
      { 
        name: 'Ambagamuwa', 
        gnDivisions: ['Kalugala', 'Pittawala', 'Bulathgama', 'Gonawala', 'Ambagamuwa North', 'Sellipigama', 'Ambagamuwa East', 'Ambagamuwa South', 'Rampadeniya', 'Millagahamulla', 'Dhagampitiya', 'Polpitiya', 'Minuwandeniya', 'Hitegegama', 'Kehelwarawa', 'Homagama', 'Hebbękanda', 'Samansirigama', 'Theeniyagala', 'Ginigathhena', 'Dehigasthenna', 'Kalaweldeniya', 'Morahenagama', 'Hangarapitiya', 'Jambuthenna', 'Kothellena', 'Waggama', 'Laxapana', 'Kiriwaneliya', 'Vidhulipura South', 'Vidulipura North', 'Watawala'] 
      },
      { 
        name: 'Norwood', 
        gnDivisions: ['Dickoya', 'Dickoya South', 'Hatton North', 'Hatton West', 'Hatton South', 'Hatton East', 'Bogawanthalawa South', 'Kirkoswald', 'New Valley Gama', 'Annfield', 'Wanarajah', 'Lethenty', 'Ingestre', 'Tillerie', 'Bogawana', 'Loinorn', 'Kotiyagala', 'Norwood', 'Maskeliya', 'Seethagangula', 'Gouravilla', 'Sthrathspey', 'Rozella', 'Ruwanpura', 'Morray', 'Mousakelle', 'Alten', 'Mahanelu', 'Venture', 'Brunswick', 'Brownlow', 'Shannon', 'Vellioya', 'Mocha', 'Panmor'] 
      },
    ]
  },
  'Galle': {
    province: 'Southern',
    divisionalSecretariats: [
      { 
        name: 'Benthota', 
        gnDivisions: ['Pahurumulla', 'Sinharoopagama', 'Yathramulla', 'Kommala', 'Bodhimaluwa', 'Dope', 'Angagoda', 'Warahena', 'Kahagalla', 'Huganthota Wadumulla', 'Dedduwa', 'Athuruwella', 'Galbada', 'Galagama', 'Mullegoda', 'Sooriyagama', 'Haburugala', 'Thunduwa West', 'Thunduwa East', 'Thotakanatta', 'Elakaka', 'Ethungagoda', 'Gonagalapura', 'Olaganduwa', 'Yalegama', 'Kaikawala', 'Habakkala', 'Etawalawatta West', 'Etawalawatta East', 'Dombagahawatta', 'Akadegoda', 'Kahawe Gammedda', 'Warakamulla', 'Kandemulla', 'Galthuduwa', 'Kolaniya', 'Miriswatta', 'Viyandoowa', 'Mahagoda', 'Pilekumbura', 'Mahavila West', 'Mahavila East', 'Moragoda', 'Ranthotuwila', 'Malawala', 'Ihala Malawala', 'Kotuwabendahena', 'Kuda Uragaha', 'Maha Uragaha', 'Delkabalagoda', 'Hipanwatta'] 
      },
      { 
        name: 'Balapitiya', 
        gnDivisions: ['Doowemodara', 'Nanathota Palatha', 'pelegaspalatha', 'Wathurawela', 'Boraluketiya', 'Pathiraja Pedesa', 'Polathu Palatha', 'Katuvila', 'Mahapitiya', 'Nape', 'Kudagodagama', 'Hegalla - Piyagama', 'Godapitiya', 'Kosgoda', 'Ahungalla', 'Bogahapitiya', 'Galvehera', 'Pathirajagama', 'Madoowa', 'Kadiragonna', 'Makumbura', 'Wathuregama', 'Wellabada', 'Pathegamgoda', 'Weliwathugoda', 'Brahmanawatta North', 'Brahmanawatta South', 'Galmangoda', 'Wandadoowa', 'Heenatiya North', 'Mahaladoowa', 'Seenigoda', 'Heenatiya South', 'Mahakarawa', 'Elathota', 'Balapitiya', 'Berathuduwa', 'Andadola', 'Petiwatta', 'Wathugedara', 'Paragahathota', 'Wathugedara South', 'Kurunduwatta', 'Walagedara', 'Randombe North', 'Wadumulla', 'Viharagoda', 'Kandegoda', 'Bogahawatta', 'Randombe South', 'Middaramulla', 'Welithara'] 
      },
      { 
        name: 'Karandeniya', 
        gnDivisions: ['Walinguruketiya', 'Uragasmanhandiya North', 'Galpottawala', 'Meegaspitiya', 'Mendorawala', 'Uragasmanhandiya South', 'Yatagala', 'Uragasmanhandiya East', 'Mabingoda', 'Hipankanda', 'Siripura', 'Beligaswella', 'Halgahawella', 'LenagalPalatha', 'Magala North', 'Kaluwalagoda', 'Diyapitagallana', 'Angulugalla', 'Magala South', 'Pehembiyakanda', 'Unagaswela', 'Madakumbura', 'Thalgahawatta', 'Mandakanda', 'Anganaketiya', 'Borakanda', 'Mahaedanda', 'Karandeniya North', 'Randenigama', 'Mahagoda', 'Karandeniya South', 'Dangahawila', 'Egodawela', 'Diviyagahawela', 'Kirinuge', 'Kiripedda', 'Galagoda Atta', 'Ihala Kiripedda', 'Kurundugaha Hethekma', 'Jayabima'] 
      },
      { 
        name: 'Elpitiya', 
        gnDivisions: ['Aviththawa', 'Pahala Omatta', 'Omatta', 'Metiviliya', 'Himbutugoda', 'Indipalegoda', 'Dikhena', 'Delpona', 'Ihala Omatta', 'Digala Nagahatenna', 'Opatha', 'Goluwamulla North', 'Goluwamulla West', 'Goluwamulla', 'Atakohota', 'Elpitiya North', 'Elpitiya East', 'Poojagallena', 'Ketandola Udowita', 'Sittaragoda', 'Amugoda', 'Kellapatha', 'Thalagaspe', 'Thalagaspe West', 'Wallambagala North', 'Elpitiya South', 'Elpitiya Central', 'Nawadagala', 'Batuwanhena', 'Igala', 'Igala East', 'Pelendagoda', 'Wallambagala', 'Ambana', 'Ambana North', 'Pituwala South', 'Pituwala North', 'Kudagala Kadirandola', 'Igala Thalawa East', 'Igala Thalawa', 'Ella', 'Ella Thanabaddegama', 'Mahawela Abayapura', 'Pituwala West', 'Eramulla', 'Pinikahana', 'Kahadoowa', 'Thibbotuwawa', 'Wathuruvila', 'Rekadahena', 'Kahadoowa South'] 
      },
      { 
        name: 'Niyagama', 
        gnDivisions: ['Pitigala North', 'Uhanovita', 'Hattaka', 'Kaluarachchigoda', 'Pitigala', 'Karawwa', 'Boraluwahena', 'Bangamukanda', 'Godamuna North', 'Marthupitiya', 'Godamuna South', 'Liyanagamakanda', 'Usbim Colony', 'Bambarawana', 'Mattaka', 'Weihena', 'Amaragama', 'Naranovita', 'Porawagama', 'Kimbulawala', 'Poddiwela West', 'Poddiwala East', 'Maraggoda', 'Duwegoda', 'Porawagama South', 'Wattahena', 'Manampita', 'Niyagama', 'Niyagama West', 'Polpelaketiya', 'Horangalla West', 'Horangalla Thalawa', 'Horangalla Akulavila', 'Niyagama South'] 
      },
      { 
        name: 'Thawalama', 
        gnDivisions: ['Ela Ihala', 'Ela Ihala North', 'Kumburegoda', 'Habarakada East', 'Habarakada West', 'Kudugalpola', 'Batahena', 'Thawalama North', 'Thawalama Mookalana', 'Thawalama South', 'Hiniduma North', 'Hiniduma West', 'Hiniduma South', 'Malgalla', 'Halvitigala Colony Step 1', 'Halvitigala Colony Step 2', 'Dammala Colony', 'Thalangalla East', 'Thalangalla West', 'Malhathawa', 'Panangala West', 'Panangala North', 'Panangala East', 'Thalangalla', 'Dammala', 'Opatha North', 'Opatha West', 'Koralegama', 'Eppala', 'Gallandala', 'Opatha South', 'Opatha East', 'Weerapana North', 'Weerapana West', 'Weerapana South', 'Weerapana East'] 
      },
      { 
        name: 'Neluwa', 
        gnDivisions: ['Danawala', 'Mavita West', 'Batuwangala West', 'Kosmulla', 'Thambalagama', 'Ehelapitiya', 'Batuwangala', 'Mavita East', 'Koswatta', 'Embalegedara North', 'Embalegedara South', 'Mawanana', 'Neluwa', 'Pahala Maddegama', 'Maddegama East', 'Happitiya', 'Madugeta', 'Warukandeniya', 'Lankagama', 'Dellawa', 'Miyanawathura', 'Pannimulla', 'Ihala Maddegama', 'Medagama', 'Pahala Gigumaduwa', 'Ihala Gigumaduwa', 'Lelwala', 'Ihala Lelwala', 'Panagoda', 'Dewalegama West', 'Dewalegama East', 'Millawa West', 'Ihala Millawa', 'Pahala Millawa'] 
      },
      { 
        name: 'Nagoda', 
        gnDivisions: ['Thalgaswala', 'Marakanda', 'Malamura', 'Aluth Thanayamgoda Pahala West', 'Mapalagama', 'Aluth Thanayamgoda Pahala', 'Aluth Thanayamgoda Ihala ( South )', 'Aluth Thanayamgoda Ihala', 'Ketagoda South', 'Ketagoda North', 'Parana Thanayamgoda', 'Parana Thanayamgoda Central', 'Parana Thanayamgoda Pahala', 'Gonalagoda East', 'Gonalagoda', 'Gammeddegoda', 'Gammeddegoda South', 'Nagoda Ihala', 'Nagoda', 'Kurupanawa', 'Gonadeniya', 'Ukovita North', 'Udugama West', 'Udugama North', 'Homadola', 'Udugama East', 'Udugama', 'Ukovita', 'Gonadeniya South', 'Udalamatta East', 'Udalamatta North', 'Keppitiyagoda', 'Udawelivitiya', 'Udawelivitithalawa East', 'Udawelivitiya Thalawa', 'Udawelivitiya West', 'Keppitiyagoda North', 'Budapanagama', 'Unanvitiya', 'Unanvitiya East', 'Urala North', 'Urala Pahala', 'Yatalamatta', 'Yatalamatta East', 'Udalamatta South', 'Udugama South', 'Udugama Central', 'Aluthwatta', 'Hangaranwala', 'Yatalamatta West', 'Urala Central', 'Urala South', 'Urala East'] 
      },
      { 
        name: 'Baddegama', 
        gnDivisions: ['Wavulagala', 'Halpathota Central', 'Halpathota', 'Baddegama Town', 'Baddegama North', 'Nayapamula', 'Kotagoda', 'Hemmeliya', 'Ellakanda Wathurawa', 'Baddegama East', 'Yahaladoowa', 'Baddegama South', 'Gothatuwa', 'Majuwana', 'Wewaldeniya', 'Keradewala', 'Madoldoowa', 'Bataketiya', 'Ganegama North', 'Sandarawala', 'Boralukada', 'Mahahengoda', 'Mahalapitiya', 'Thilaka Udagama', 'Pilagoda', 'Ganegama East', 'Ganegama South', 'Ganegama West', 'Lelkada', 'Ginimellagaha West', 'Ginimellagaha East', 'Dodangoda', 'Thelikada', 'Walpita North', 'Keembi Ela', 'Kohombanadeniya', 'Kasideniya', 'Pahala Keembiya', 'Warakapitikanda', 'Adurathvila', 'Walpita South', 'Balagoda', 'Ginimellagaha Sorth', 'Pituwalgoda', 'Thelikada Nagare', 'Horagampita Central', 'Gonapura', 'Horagampita'] 
      },
      { 
        name: 'Waduramba', 
        gnDivisions: ['Indurupathvila', 'Weihena', 'Mabotuwana', 'Nattewela', 'Thalawa', 'Ihala Lelwala', 'Kumbalamalahena', 'Panvila', 'Pahala Lelwala', 'Kokawala', 'Polgahavila', 'Deiyandara', 'Kirindalahena', 'Meda Keembiya', 'Meda Keembiya East', 'Pitiharawa', 'Thiruwanaketiya', 'Ihala Keembiya', 'Ihala Keembiya South', 'Wanduramba', 'Wanduramba South', 'Gulugahakanda'] 
      },
      { 
        name: 'Welivitiya-Divithura', 
        gnDivisions: ['Ethkandura', 'Old Colony', 'Thanabaddegama', 'Maddevila', 'Miriswatta', 'Nambaraatta', 'Divithura East', 'Polgahavila', 'Divithura', 'Ampegama', 'Hamingala', 'Nugethota', 'Agaliya', 'Divithura South', 'Galahenkanda', 'Kuttiyawatta', 'Pathaweliwitiya North', 'Waduwelivitiya North', 'Pathawelivitiya', 'Waduwelivitiya'] 
      },
      { 
        name: 'Ambalangoda', 
        gnDivisions: ['Heppumulla', 'Patabendimulla', 'Kariththakanda', 'Kaluwadumulla', 'Okanda', 'Keraminiya', 'Polwatta', 'Thalgasgoda', 'Thilakapura', 'Thanipolgahalanga', 'Batapola Central', 'Kondagala', 'Batapola North', 'Kobeithuduwa', 'Godahena', 'Poramba', 'Vilegoda', 'Paniyandoowa', 'Hirewatta', 'Maha Ambalangoda', 'Batadoowa', 'Batapola West', 'Batapola South', 'Dorala', 'Batapola East', 'Polhunnawa', 'Nawagama', 'Nindana', 'Lewdoowa', 'Udakerawa', 'Domanwila', 'Diddeliya', 'Eranawila', 'Meetiyagoda', 'Matiwala', 'Walakada'] 
      },
      { 
        name: 'Hikkaduwa', 
        gnDivisions: ['Wellawatta', 'Hikkaduwa Nagarikaya', 'Wavulagoda West', 'Wavulagoda East', 'Hikkaduwa West', 'Nakanda', 'Hikkaduwa Central', 'Nalagasdeniya', 'Millagoda', 'Pannamgoda', 'Wewala', 'Narigama Wellabada', 'Narigama', 'Kuda Wewala', 'Delgahadoowa', 'Katukoliha', 'Thiranagama', 'Wellabada Thiranagama', 'Patuwatha', 'Gammaduwatta', 'Hennathota', 'Pinkanda', 'Handaudumulla', 'Dodandugoda', 'Modara Patuwatha', 'Dodandoowa', 'Uduhalpitiya'] 
      },
      { 
        name: 'Rathgama', 
        gnDivisions: ['Pitiwella North', 'Pitiwella South', 'Kadurupe', 'Kedala', 'Boossa', 'Rupiwala', 'Ganegoda', 'Kapumulugoda', 'Rathna Udagama', 'Dolikanda', 'Mahahegoda', 'Maliduwa', 'Medawala', 'Palanthriyagoda', 'Hegoda', 'Rejjipura', 'Rathgama Hegoda', 'Ranapanadeniya', 'Kandegoda', 'Palliyapitiya', 'Gammeddagoda', 'Gammeddagoda Rathgama', 'Gammeddagoda East', 'Owakanda', 'Katudampe', 'Thotavila', 'Imbula', 'Mawadawila', 'Panvila Pahalagoda', 'Krawegoda', 'Devinigoda', 'Bopagoda'] 
      },
      { 
        name: 'Madampagama', 
        gnDivisions: ['Thotagamuwa', 'Kalupe', 'Udumulla', 'Medagoda', 'Werellana', 'Seenigama East', 'Seenigama West', 'Malawenna', 'Thelwatta', 'Pereliya North', 'Pereliya South', 'Daluwathumulla', 'Kahawa', 'Godagama South', 'Godagama North', 'Uduwaragoda South', 'Uduwaragoda North', 'Weragoda', 'Galdoowa', 'Harannagala', 'Delmar Colony', 'Akurala', 'Akurala South', 'Akurala North', 'Wenamulla', 'Andurangoda', 'Dimbuldoowa', 'Kuleegoda West', 'Galagoda East', 'Kuleegoda East', 'Galagoda West', 'Wellabada', 'Usmudulawa', 'Urawatta', 'Idanthota', 'Dewagoda East', 'Dewagoda West', 'Deldoowa'] 
      },
      { 
        name: 'Galle Four Gravets', 
        gnDivisions: ['Ukwatta East', 'Ukwatta West', 'Maha Hapugala', 'Kurunduwatta', 'Welipitimodara', 'Ginthota West', 'Ginthota East', 'Piyadigama', 'Bope North', 'Bope East', 'Kumbalwella North', 'Madawalamulla North', 'Madawalamulla South', 'Deddugoda North', 'Deddugoda South', 'Maitipe', 'Welipatha', 'Maligaspe', 'Dangedara East', 'Dangedara West', 'Bataganvila', 'Galwadugoda', 'Richmond Kanda', 'Bope West', 'Siyambalagahawatta', 'Dadalla East', 'Dadalla West', 'Walawwatta', 'Kumbalwella South', 'Mahamodara', 'Osanagoda', 'Kandewatta', 'Sangamithpura', 'Madapathala', 'Pokunawatta', 'Milidduwa', 'Eththiligoda South', 'Makuluwa', 'Pettigalawatta', 'Thalapitiya', 'Koongaha', 'Weliwatta', 'Minuwangoda', 'Kaluwella', 'China Garden', 'Fort', 'Magalla', 'Dewathura', 'Katugoda', 'Dewata'] 
      },
      { 
        name: 'Bope-Poddala', 
        gnDivisions: ['Poddala', 'Pannamaga', 'Mulana West', 'Mulana East', 'Panvila', 'Narawala', 'Walawatta', 'Magadeniya', 'Baswatta', 'Addaragoda', 'Meepawala', 'Panideniya', 'Opatha', 'Wakwella', 'Niladeniya', 'Hapugala', 'Beraliyadola', 'Silvagewatta', 'Uluvitike', 'Holuwagoda', 'Labudoowa', 'Kurunda Kanda', 'Kurunda', 'Thotagoda', 'Galketiya', 'Godakanda', 'Bangalawatta', 'Bokaramullagoda', 'Thunhiripana', 'Abeysundara Watta', 'Watareka East', 'Pelawatta', 'Mampitiya', 'Kalegana South', 'Kalegana North', 'Kithulampitiya', 'Kahaduwawatta', 'Navinna', 'Hirimburagama', 'Karapitiya', 'Ambagahawatta', 'Kapuhempala', 'Karanwila', 'Paliwathugoda'] 
      },
      { 
        name: 'Akmeemana', 
        gnDivisions: ['Thalgasyaya', 'Niyagama', 'Ambagahavila', 'Ihalagoda East', 'Amalgama', 'Ketandola', 'Hiyare North', 'Kandahena', 'Welihena', 'Kadurugashena', 'Hiyare East', 'Ihala Hiyare', 'Hiyare South', 'Etambagasmulla', 'Ihalagoda Colony', 'Ihalagoda South', 'Ihalagoda West', 'Akmeemana', 'Ganegoda', 'Ganegoda West', 'Kirindagoda', 'Badungoda Colony', 'Badungoda', 'Pinnadoowa Colony', 'Weliketiya', 'Halgasmulla', 'Amukotuwa', 'Nivithipitigoda', 'Thalahitiyawa', 'Ankokkawala', 'Pinnadoowa', 'Manawila', 'Walahanduwa', 'Yakgaha', 'Meegoda', 'Pilana', 'Pedinnoruwa', 'Melegoda', 'Bambaragoda', 'Anangoda', 'Hinidumgoda', 'Keranvila Colony', 'Halivala', 'Ettiligoda North', 'Ambalanwatta', 'Jambuketiya', 'Bataduwa', 'Kaduruduwa', 'Panagamuwa', 'Galgamuwa', 'Divulana Colony', 'Handugoda', 'Kalahe', 'Wanchawala', 'Attaragoda', 'Nugaduwa', 'Batadoowa West', 'Thalpegoda', 'Yatagama', 'Rathkindagoda', 'Metaramba', 'Thalpe North', 'Nagahawatta'] 
      },
      { 
        name: 'Yakkalamulla', 
        gnDivisions: ['Nawala', 'Thellambura North', 'Nakiyadeniya', 'Nakiyadeniya North', 'Wattahena', 'Wathogala', 'Moraketiya', 'Gahalakoladeniya', 'Udumalagala', 'Ihala Nakiyadeniya', 'Thellambura Pahala', 'Thellambura Iahala', 'Nevungala', 'Nevungala South', 'Kottawa', 'Thellambura South', 'Yakkalamulla East', 'Nabadawa', 'Yatamalagala', 'Karagoda Ihala', 'Magedara North', 'Magedara East', 'Ella Ihala', 'Magedara', 'Uduwella', 'Karagoda', 'Karagoda Pahala', 'Polpagoda', 'Beranagoda', 'Yakkalamulla', 'Kottawa East', 'Kottawa West', 'Thalgampala North', 'Udubettawa', 'Udubattawa West', 'Thalgampala', 'Hiriyamalkumbura', 'Polpagoda West', 'Kaludiyawala', 'Badungala', 'Rathambalaketiya', 'Welendawa', 'Walpola Pahala', 'Ihala Walpola'] 
      },
      { 
        name: 'Imaduwa', 
        gnDivisions: ['Pituwalahena', 'Mayakaduwa', 'Kabaragala', 'Danduwana', 'Hatangala', 'Bedipita', 'Puswelkada', 'Ihala Kombala', 'Kombala', 'Imaduwa Athireka', 'Paragoda', 'Wathawana', 'Hawpe North', 'Hawpe', 'Angulugaha', 'Rangoda', 'Dorape', 'Welikonda', 'Pelawatta', 'Polhena', 'Kahanda', 'Kahanda Athireka 1', 'Godauda Mandiya', 'Mawella', 'Deegoda Athireka 01', 'Imaduwa', 'Hettigoda', 'Deegoda', 'Kalugalgoda', 'Ihala Mawella', 'Thittagalla East', 'Ampavila', 'Malalgodapitiya', 'Dikkumbura', 'Kodagoda South', 'Kodagoda East', 'Horadugoda', 'Ellalagoda', 'Andugoda', 'Panugalgoda', 'Indurannavila', 'Atanikitha', 'Thittagalla West'] 
      },
      { 
        name: 'Habaraduwa', 
        gnDivisions: ['Yaddehimulla', 'Bonavistawa', 'Unawatuna West', 'Unawatuna East', 'Maharamba', 'Dalawella', 'Unawatuna Central', 'Thalpe South', 'Heenatigala South', 'Wellethota', 'Haloluwagoda', 'Handogoda', 'Dodampe', 'Attaragoda', 'Thalpe East', 'Kahawennagama', 'Morampitigoda', 'Uragasgoda', 'Pitidoowa', 'Meepe', 'Bogahamulugoda', 'Happawana', 'Annasiwathugoda', 'Harumalgoda West', 'Lanumodara', 'Liyanagoda', 'Katukurunda', 'Harumalgoda Central', 'Godawatta', 'Harumalgoda East', 'Koggala Additional I', 'Koggala Additional II', 'Koggala', 'Kathluwa West', 'Atadahewathugoda', 'Kathluwa East', 'Welhengoda', 'Kathluwa Central', 'Alawathukisgoda', 'Pelessa', 'Korahendigoda', 'Ahangama Nakanda', 'Kalapuwa', 'Ahangamgoda', 'Danduhela', 'Meegahagoda', 'Kahawathugoda', 'Meliyagoda', 'Piyadigama West', 'Wadugegoda', 'Karandugoda', 'Kalahegoda', 'Dommannagoda', 'Piyadigama East', 'Ahangama Central', 'Digaredda', 'Thaldoowa', 'Ahangama East', 'Goviyapana'] 
      },
      { 
        name: 'Gonapinuwala', 
        gnDivisions: ['Karuwalabedda', 'Manampita', 'Dangaragaha Udumulla', 'Banwelgodella', 'Eriyagahamulla', 'Aluthwala', 'Mahagangoda', 'Kirindiela', 'Thilakagama', 'Henagoda', 'Gonapeenuwala Central', 'Woodland Watta', 'Berathuduwa', 'Hikkaduwa East', 'Arachchikanda', 'Gonapinuwala East', 'Gonapinuwala West', 'Dodankahawila', 'Kaluwagaha Colony'] 
      },
    ]
  },
  'Matara': {
    province: 'Southern',
    divisionalSecretariats: [
      { 
        name: 'Pitabeddara', 
        gnDivisions: ['Kalubovitiyana', 'Galabada', 'Ambewela', 'Dangala West', 'Banagala East', 'Dangala East', 'Banagala West', 'Edandukitha West', 'Edandukitha East', 'Alapaladeya South', 'Alapaladeya North', 'Kiriwelkele North', 'Rambukana West', 'Kodikaragoda West', 'Kodikaragoda East', 'Weliwa', 'Rambukana East', 'Thalapekumbura', 'Kudagalahena', 'Kiriwelkele South', 'Derangala', 'Thannehena', 'Gorakawela', 'Siyambalagoda West', 'Kosnilgoda', 'Aluwana', 'Paradupalla', 'Mahapotuvila', 'Dankoluwa', 'Pitabaddera', 'Kaduruwana', 'Dehigaspa', 'Kotagala', 'Siyambalagoda East', 'Wanasinkanda', 'Diyadawa', 'Ihala Ainagama', 'Emaldeniya', 'Waturakumbura', 'Puwakbadovita'] 
      },
      { 
        name: 'Kotapola', 
        gnDivisions: ['Mederipitiya', 'Keeriwalagama', 'Kiriweldola', 'Kandilpana', 'Viharahena', 'Adaradeniya', 'Ihalagama', 'Bateyaya', 'Pussawela', 'Pallegama North', 'Pathawala Nadakanda', 'Poddana', 'Kolawenigama', 'Pallegama South', 'Deniyaya West', 'Deniyaya', 'Kalugalahena', 'Thenipita', 'Mugunumulla', 'Nawalahena', 'Kotapola North', 'Nissankapura', 'Beliattakumbura', 'Morawaka', 'Porupitiya', 'Waralla', 'Koodaludeniya', 'Kotapola South', 'Usamalagoda', 'Lindagawahena', 'Kosmodara', 'Ilukpitiya', 'Horagala East', 'Horagala West', 'Uvaragala', 'Pelawatta', 'Paragala'] 
      },
      { 
        name: 'Pasgoda', 
        gnDivisions: ['Batandura South', 'Batandura North', 'Thalapelakanda', 'Kekundeniya', 'Ketawala', 'Ginnaliya North', 'Pattigala', 'Beralapanathara South', 'Beralapanathara North', 'Wijayagama', 'Pathavita', 'Kirilapane', 'Moragala', 'Keeripitiya East', 'Urubokka', 'Ginnaliya West', 'Ginnaliya South', 'Ginnaliya East', 'Mekiliyathenna', 'Heegoda', 'Keeripitiya West', 'Poddeniya', 'Mologgamuwa North', 'Mologgamuwa South', 'Bengamuwa West', 'Bengamuwa East', 'Dampahala West', 'Hulankanda', 'Dampahala East', 'Pasgoda', 'Bengamuwa South', 'Denkandaliya', 'Panakaduwa Wast', 'Rotumba East', 'Napathella', 'Adaluwa', 'Ehelakanda', 'Galketikanda', 'Rotumba West', 'Panakaduwa East', 'Gomila', 'Puwakgahahena', 'Mawarala'] 
      },
      { 
        name: 'Mulatiyana', 
        gnDivisions: ['Gombaddala North', 'Kudapana', 'Ketapalakanda', 'Gammedagama', 'Ketiyape North', 'Athapattukanda', 'Parapamulla East', 'Ketiyape South', 'Galetumba', 'Neralampitiya', 'Mulatiyana', 'Diddenipotha North', 'Beragama North', 'Gombaddala South', 'Beragama West', 'Beragama South', 'Makandura West', 'Beragama East', 'Diddenipotha East', 'Diddenipotha South', 'Seenipella West', 'Maduwala', 'Seenipella East', 'Deiyandara', 'Parapamulla West', 'Parapamulla South', 'Dewalegama West', 'Dewalegama East', 'Batadola', 'Kithsiripura', 'Radawela West', 'Belpamulla', 'Bamunugama West', 'Makandura East', 'Ransegoda East', 'Meepavita', 'Mudaligedara', 'Rathkekulawa', 'Ransegoda North', 'Ransegoda South', 'Ransegoda West', 'Koramburuwana', 'Horapavita South', 'Horapavita North', 'Bamunugama East', 'Radawela East', 'Pallawela', 'Pitawalgamuwa'] 
      },
      { 
        name: 'Athuraliya', 
        gnDivisions: ['Kehelwala', 'Urumutta', 'Urumutta South', 'Dematapassa', 'Divithura', 'Welihena', 'Howpe', 'Thalahagama West', 'Wenagama', 'Thalahagama East', 'Uggashena', 'Vilpita West', 'Kanahalagama', 'Godapitiya', 'Maragoda', 'Panadugama', 'Thibbotuwawa North', 'Walagepiyadda', 'Vilpita East 1', 'Vilpita East 2', 'Yahamulla', 'Naburukanda', 'Ihala Athuraliya', 'Balakawala', 'Thibbotuwawa', 'Athuraliya West', 'Athuraliya East', 'Pahala Athuraliya'] 
      },
      { 
        name: 'Akuressa', 
        gnDivisions: ['Diganahena', 'Lenama North', 'Hulandawa', 'Maramba North', 'Peddapitiya North', 'Idikakudeniya', 'Lenama South', 'Udupitiya', 'Weliketiya', 'Dediyagala', 'Vilagama', 'Ehelape', 'Dolamawatha', 'Kohugoda', 'Ihala Maliduwa', 'Ketanvila', 'Nawalagoda', 'Ellewela', 'Minipogoda', 'Peddapitiya South', 'Maramba South', 'Ganhela', 'Asmagoda', 'Hikgoda', 'Diyalape', 'Eramudugoda', 'Manikgoda', 'Pahala Maliduwa', 'Bopitiya', 'Iluppella', 'Imbullgoda', 'Poramba', 'Akuressa', 'Yakabwdda', 'Galabadahena', 'Ihala Kiyaduwa', 'Melewwa', 'Paraduwa North', 'Paraduwa East', 'Paraduwa South', 'Henegama', 'Henegama West', 'Gallala', 'Nimalawa East', 'Nimalawa', 'Paragahawatta'] 
      },
      { 
        name: 'Welipitiya', 
        gnDivisions: ['Wahala Kananke North', 'Nivithiwelbokka', 'Poramba Kananke North', 'Puhulahena', 'Poramba Kananke South', 'Wahala Kananke South', 'Nalawana', 'Penetiyana West', 'Penetiyana East', 'Wellana', 'Udukawa North', 'Udukawa South', 'Hallala', 'Bathalahena', 'Kokmaduwa North', 'Sahabandu Kokmaduwa', 'Jamburegoda East', 'Padili Kokmaduwa', 'Beraleliya', 'Jayawickramapura', 'Warakapitiya North', 'Warakapitiya East', 'Warakapitiya South', 'Meeruppa', 'Uruvitiya', 'Watagedaramulla', 'Moonamalpa', 'Welipitiya', 'Palalla', 'Jamburegoda West', 'Ibbawala', 'Vilegoda', 'Borala', 'Maduragoda', 'Kapuwatta', 'Denipitiya Central', 'Denipitiya West', 'Denipitiya East'] 
      },
      { 
        name: 'Malimbada', 
        gnDivisions: ['Elgiriya', 'Pahala Kiyaduwa', 'Maragoda', 'Kekunawela', 'Kadduwa', 'Dampella', 'Horagoda East', 'Horagoda West', 'Horagoda South', 'Kadukanna', 'Weladagoda', 'Uninduwela', 'Thelijjavila', 'Nape', 'Akurugoda North', 'Akurugoda East', 'Kirimetimulla South', 'Kirimetimulla North', 'Malimbeda West', 'Katuwangoda', 'Malimbada East', 'Malimbada North', 'Malimbada South', 'Galpamuna', 'Akurugoda South', 'Akurugoda West', 'Sulthanagoda West', 'Sulthanagoda East', 'Sulthanagoda South'] 
      },
      { 
        name: 'Kamburupitiya', 
        gnDivisions: ['Gathara West', 'Gathara North', 'Gathara East', 'Beragammulla', 'Eriyathota', 'Ganegama', 'Narandeniya East', 'Narandeniya West', 'Malana', 'Magamure', 'Sapugoda', 'Lenabatuwa', 'Bibulewela', 'Godawa', 'Pitakatuwana', 'Kamburupitiya', 'Ullala East', 'Thumbe', 'Karaputugala North', 'Karaputugala South', 'Ullala Masmulla', 'Ullala West', 'Mapalana Mangin Ihala', 'Mapalana Magin Pahala', 'Seewelgama', 'Ihala Vitiyala North', 'Karagoda Uyangoda 1 Atha East', 'Karagoda Uyangoda 1 West', 'Karagoda Uyangoda 2 West', 'Karagoda Uyangoda 2 East', 'Ihala Vitiyala West', 'Ihala Vitiyala South', 'Ihala Vitiyala East', 'Akurugoda', 'Kahagala', 'Kahagala South', 'Urapola East', 'Palolpitiya', 'Urapola West'] 
      },
      { 
        name: 'Hakmana', 
        gnDivisions: ['Denagama East', 'Denagama North', 'Denagama West', 'Badabadda', 'Meeella', 'Pananwela East', 'Pananwela West', 'Kohuliyadda', 'Kebiliyapola North', 'Wepathaira North', 'Wepathaira West', 'Kandegoda', 'Narawelpita East', 'Narawelpita North', 'Ellewela East', 'Ellewela West', 'Narawelpita South', 'Beruwewela', 'Muruthamuraya', 'Muruthamuraya West', 'Muruthamuraya East', 'Wepathaira South', 'Kebiliyapola South', 'Gangodagama', 'Pottewela', 'Lalpe', 'Gammedapitiya', 'Udupeellegoda East', 'Udupeellegoda West', 'Kongala East', 'Kongala South', 'Kongala Central', 'Kongala West', 'Narawelpita West'] 
      },
      { 
        name: 'Kirinda Puhulwella', 
        gnDivisions: ['Ovitigamuwa South', 'Ovitigamuwa North', 'Malwathugoda', 'Galkanda', 'Kirinda Magin Pahala', 'Kirinda Magin Ehala North', 'Hettiyawala West', 'Hettiyawala North', 'Boraluketiya', 'Karathota', 'Naradda', 'Kumbalgoda', 'Hettiyawala East', 'Hettiyawala South', 'Wavulanbokka', 'Puhulwella East', 'Puhulwella West', 'Kirinda Magin Ihala South', 'Kirinda Magin Ihala Central', 'Kirinda Magin Ihala East', 'Wathukolakanda East', 'Walakanda South', 'Walakanda West', 'Walakanda East', 'Wathukolakanda North'] 
      },
      { 
        name: 'Thihagoda', 
        gnDivisions: ['Pahala Vitiyala West', 'Pahala Vitiyala Central', 'Pahala Vitiyala East', 'Polathugoda', 'Batuvita I', 'Batuvita 2', 'Medauyangoda', 'Akkara Panaha', 'Yatiyana', 'Kottawatta', 'Komangoda 2', 'Komangoda 1', 'Thihagoda East', 'Thihagoda', 'Kithalagama East 2', 'Kithalagama East 3', 'Kithalagama Central', 'Narangala', 'Wellethota', 'Kithalagama West', 'Kithalagama East 1', 'Naimbala 1', 'Kapudoowa', 'Kapudoowa East', 'Uduwa West', 'Uduwa East', 'Galbada', 'Naimbala 2', 'Bandattara 2', 'Watagedara East', 'Attudawa', 'Attudawa West', 'Watagedara', 'Nadugala 2', 'Nadugala 1', 'Bandattara 1', 'Elambathalagoda', 'Palatuwa', 'Unella', 'Dematahettigoda'] 
      },
      { 
        name: 'Weligama', 
        gnDivisions: ['Midigama North', 'Pathegama', 'Moodugamuwa West', 'Moodugamuwa East', 'Kohunugamuwa', 'Walana', 'Wekada', 'Denuwala', 'Midigama West', 'Midigama East', 'Hetti Weediya', 'New Street', 'Polwatta', 'Nidangala', 'Kotavila West', 'Kotavila North', 'Kamburugamuwa North', 'Kotavila South', 'Henwala East', 'Polwathumodara', 'Pelena North', 'Pelena West', 'Galbokka East', 'Galbokka West', 'Paranakade', 'Walliwala East', 'Pitidoowa', 'Gurubebila', 'Walliwala West', 'Walliwala South', 'Maha Weediya', 'Pelena South', 'Henwala West', 'Garanduwa', 'Mirissa Udumulla', 'Mirissa Udupila', 'Mirissa North', 'Mirissa South 2', 'Kapparathota South', 'Kapparathota North', 'Mirissa South 1', 'Bandaramulla', 'Thal Aramba North', 'Thudella', 'Kamburugamuwa South', 'Kamburugamuwa West', 'Thal Aramba East', 'Thal Aramba South', 'Aluthweediya'] 
      },
      { 
        name: 'Four Gravets', 
        gnDivisions: ['Diyagaha East', 'Kekanadura East', 'Kokawala', 'Parawahara East', 'Parawahera North', 'Kekanadura North', 'Kekanadura Central', 'Deeyagaha West', 'Navimana North', 'Pahalagoda', 'Navimana South', 'Thudawa East', 'Thudawa North', 'Thudawa South', 'Sudarshi Place', 'Hittatiya East', 'Hittatiya Meda', 'Godagama', 'Eduwa -Madurudoowa', 'Kanattagoda North', 'Wewahamandoowa', 'Hittatiya West', 'Isadeen Town', 'Weliweriya West', 'Weliweriya East', 'Walpala', 'Weragampita', 'Ruwan Ella', 'Kekanadura West', 'Kakanadura South', 'Parawahera South', 'Thalpavila North', 'Nakuttiya', 'Veherahena', 'Makavita', 'Weradoowa', 'Uyanwatta', 'Uyanwatta North', 'Kadeweediya East', 'Kadeweediya West', 'Welegoda East', 'Welegoda West', 'Mathotagama', 'Walgama North', 'Kanattagoda South', 'Madiha West', 'Walgama', 'Walgama Meda', 'Walgama South', 'Madiha East', 'Polhena', 'Pamburana', 'Noope', 'Kadeweediya South', 'Thotamuna', 'Fort', 'Kotuwegoda North', 'Eliyakanda North', 'Meddawatta', 'Rassanadeniya', 'Wewa Ihalagoda', 'Thalpavila South', 'Gandarawatta South', 'Meddawatta South', 'Eliyakanda South', 'Kotuwegoda South'] 
      },
      { 
        name: 'Devinuwara', 
        gnDivisions: ['Kadawedduwa West', 'Kadawedduwa East', 'Walbulugahahena', 'Aparekka North', 'Uda Aperakka East', 'Uda Aparekka', 'Palle Aparekka', 'Agarawala', 'Beddegammedda', 'Pathegama East', 'Pathegama North', 'Naotunna', 'Naotunna North', 'Thalalla North', 'Thalalla East', 'Thalalla South', 'Naotunna Central', 'Naotunna South', 'Thalalla Central', 'Delgalla', 'Kapugama North', 'Kapugama West', 'Gandarawaththa Kotasak', 'Kapugama Central', 'Kapugama East', 'Gandara East', 'Thalalla', 'Gandara South', 'Gandara Central', 'Gandara West', 'Devinuwara North', 'Devinuwara Central', 'Devinuwara Nugegoda', 'Devinuwara West', 'Devinuwara East', 'Devinuwara Wawwa', 'Devinuwara Light House Place', 'Devinuwara', 'Devinuwara Welegoda', 'Devinuwara Sinhasana Pedesa', 'Devinuwara South'] 
      },
      { 
        name: 'Dickwella', 
        gnDivisions: ['Urugamuwa North', 'Bodarakanda', 'Urugamuwa East', 'Urugamuwa Central', 'Urugamuwa West', 'Dandeniya North', 'Urugamuwa South', 'Rannawala', 'Urugamuwa', 'Wehella', 'Wehella North', 'Dandeniya South', 'Bambarenda North', 'Pohosathugoda', 'Rathmale', 'Bambarenda Central', 'Wehella South', 'Wattegama', 'Wattegama North', 'Walasgala West', 'Walasgala East', 'Wewurukannala', 'Dickwella North', 'Dodampahala North', 'Dodampahala East', 'Dodampahala Central', 'Dodampahala West', 'Dodampahala South', 'Dickwella East', 'Dickwella Central', 'Dickwella Mislim Yonakapura East', 'Dickwella Mislim Yonakapura West', 'Dickwella South', 'Wattegama South', 'Bathigama East', 'Batheegama Central', 'Bathigama West', 'Bambarenda East', 'Bambarenda South', 'Bambarenda West', 'Belideniya', 'Pathegama Central', 'Pathegama South', 'Beliwatta', 'Suduwella', 'Kottagoda', 'Godauda', 'Lunukalapuwa'] 
      },
    ]
  },
  'Hambantota': {
    province: 'Southern',
    divisionalSecretariats: [
      { 
        name: 'Sooriyawewa', 
        gnDivisions: ['Ihala Kumbukwewa', 'Mahagalwewa', 'Meegaha Jandura', 'Ranmuduwewa', 'Weliwewa', 'Suravirugama', 'Samajasewapura', 'Weeriyagama', 'Hathporuwa', 'Weniwal Ara', 'Aliolu Ara', 'Sooriyawewa Town', 'Viharagala', 'Beddewewa', 'Mahawelikada Ara', 'Andarawewa', 'Namadagaswewa', 'Mahapelessa', 'Bediganthota', 'Habaraththawala', 'Wediwewa'] 
      },
      { 
        name: 'Lunugamvehera', 
        gnDivisions: ['Mahaaluthgamara', 'Angunakolawewa', 'Weheragala', 'Ranawaranawa', 'Dewramwehera', 'Bogahawewa', 'Padawgama', 'Punchiappujandura', 'Lunugamvehera New Town', 'Seenimunna', 'Kendagasmankada', 'Mahanagapura', 'Muwanwewa', 'Weeravil Ara', 'Iththanwekada', 'Maththala', 'Pahala Maththala', 'Mihindupura', 'Abayapura', 'Singhapura', 'Senapura', 'Agbopura', 'Karambawewa', 'Rambukwewa', 'Keerthipura', 'Samanpura', 'Ranasiripura', 'Weeravila', 'Weligatta', 'Beralihela', 'Dutugemunupura', 'Jayagama', 'Parakramapura', 'Saddhathissapura', 'Saddhathissapura New Town', 'Saliyapura'] 
      },
      { 
        name: 'Tissamaharama', 
        gnDivisions: ['Kawanthissapura', 'Kirinda', 'Uddhakandara', 'Joolpallama', 'Weerahela', 'Vijithapura', 'Ellagala', 'Anjaligala', 'Pannagamuwa', 'Dambewelena', 'Mahindapura', 'Gemunupura', 'Ekamuthugama', 'Sandungama', 'Debarawewa', 'Kachcheriyagama', 'Sandagiripura', 'Mahasenpura', 'Shuddha Nagaraya', 'Medawelena', 'Rohanapura', 'Senapura', 'Gangasiripura', 'Polgahawelena', 'Randunuwatta', 'Molakapupatana', 'Tissapura', 'Uduvila', 'Rubberwatta', 'Tissamaharama', 'Gotabhayapura', 'RanaKeliya', 'Viharamahadevipura', 'Yodhakandiya', 'Welipothewela', 'Halmillawa', 'Rathnelumwalayaya', 'Gonagamuwa', 'Saliyapura', 'Nedigamvila', 'Wijayapura', 'Konwelena', 'Magama', 'Andaragasyaya'] 
      },
      { 
        name: 'Hambantota', 
        gnDivisions: ['Elalla', 'Ketanwewa', 'Tammannawa', 'Bandagiriya', 'Yahangala East', 'Joolgamuwa', 'Yahangala West', 'Keliyapura', 'Gonnoruwa', 'Bellagaswewa', 'Galwewa', 'Siyambalagaswila South', 'Siyambalagaswila North', 'Uda Beragama', 'Arawanamulla', 'Pahala Beragama', 'Dehigahalanda', 'Walawa', 'Godawaya', 'Sisilasa Gama', 'Manajjawa', 'Samodagama', 'Mirijjawila', 'Hambantota West', 'Hambantota East', 'Siribopura', 'Koholankala', 'Pallemalala', 'Bundala', 'Siriyagama'] 
      },
      { 
        name: 'Ambalantota', 
        gnDivisions: ['Siyabalakote', 'Barawakumbuka', 'Thaligala', 'Liyangasthota', 'Wetiya', 'Murawesihena', 'Mahajandura', 'Handunkatuwa', 'Rote', 'Hedavinna', 'Ridiyagama', 'Punchihenayagama', 'Poliyarwaththa', 'Godakoggala', 'Koggalla', 'Modarapiliwala', 'Bolana North', 'Jansagama', 'Mamadala South', 'Mamadala North', 'Ethbatuwa', 'Mulana', 'Eraminiyaya', 'Ihalagama', 'Deniya', 'Elegoda West', 'Elegoda East', 'Beminiyanvila', 'Walawewatta West', 'Walawewatta East', 'Bolana South', 'Kuda Bolana', 'Palugahagodella', 'Rotawala', 'Uhapitagoda', 'Miniethiliya', 'Pingama', 'Pallegama', 'Hungama', 'Bata Atha North', 'Bata Atha South', 'Hathagala', 'Kiula South', 'Kiula North', 'Lunama North', 'Lunama South', 'Nonagama', 'Ekkassa', 'Welipatanvila', 'Malpettawa', 'Puhulyaya', 'Ambalantota North', 'Ambalantota South', 'Wanduruppa', 'Thawaluvila'] 
      },
      { 
        name: 'Angunakolapelessa', 
        gnDivisions: ['Kariyamadiththa', 'Dabarella North', 'Rathmalwala', 'Kailawelapotawa', 'Kendaketiya', 'Dabarella South', 'Thalawa North', 'Thalawa South', 'Debokkawa South', 'Debokkawa North', 'Uswewa', 'Metigathwala', 'Amarathungama', 'Sooriyapokuna', 'Pahalagama', 'Kohombagaswewa', 'Dikwewa', 'Abesekaragama', 'Kalawelwala', 'Meda Ara', 'Binkama', 'Karagahawala', 'Dandenigama', 'Guruwala', 'Weeragaswewa', 'Gajanayakagama', 'Medagoda', 'Dimbulgoda', 'Aththanayala East', 'Attanayala West', 'Wakamulla', 'Heenbunna', 'Makuladeniya', 'Udayala', 'Medayala', 'Bogamuwa', 'Daha Amuna', 'Julamulla', 'Jandura', 'Helekada', 'Aluthwewa', 'Kankanamgama', 'Achariyagama', 'Angunakolapelessa', 'Yakagala', 'Gurunnehegeara', 'Kotawaya', 'Netalaporuwa', 'Hakuruwela', 'Indigetawela', 'Thalamporuwa'] 
      },
      { 
        name: 'Weeraketiya', 
        gnDivisions: ['Mulanyaya', 'Handapangala Ayna', 'Heellageayna', 'Kudagal Ara', 'Okandayaya North', 'Okandayaya West', 'Kaluwagahayaya', 'Ihala Gonadeniya', 'Debokkawa West', 'Debokkawa East', 'Wekandawala North', 'Pahala Gonadeniya', 'Kudabibula North', 'Galpoththayaya North', 'Galpottayaya South', 'Malhewage ayna', 'Kadamadiththa', 'Meegas Ara', 'Kuda Bibula South', 'Abakolawewa South', 'Abakolawewa North', 'Morayaya North', 'Morayaya South', 'Kemegala', 'Wekandawala South', 'Thelambuyaya', 'Siyambalaheddawa', 'Degampotha', 'Kinchigune West', 'Medagama', 'Raluwa', 'Kinchigune South', 'Kinchigune East', 'Madamulana', 'Yakgasmulla', 'Udukirivila', 'Buddhiyagama North', 'Keppitiyawa North', 'Iththademaliya East', 'Iththademaliya West', 'Iththademaliya South', 'Athubode West', 'Athubode East', 'Kappitiyawa South', 'Buddhiyagama West', 'Buddhiyagama East', 'Weeraketiya West', 'Mandaduwa', 'Agrahera', 'Weeraketiya East', 'Mulgirigala East', 'Mulgirigala North', 'Mulgirigala West', 'Mulgirigala South', 'Badigama West', 'Badigama North', 'Badigama East', 'Bedigama South', 'Kuda Badigama', 'Madagoda'] 
      },
      { 
        name: 'Katuwana', 
        gnDivisions: ['Karivilakanda', 'Medakanda', 'Hingurakanda', 'Uda Alupothdeniya', 'Pahala Alupothdeniya', 'Kohomporuwa', 'Gangulandeniya', 'Ambagasara', 'Labuhengoda', 'Sapugahayaya', 'Hellala', 'Middeniya North', 'Middeniya East', 'Kudagoda West', 'Kudagoda East', 'Dambethalawa', 'Murungasyaya East', 'Murungasyaya West', 'Middeniya West', 'Welipitiya East', 'Welipitiya', 'Welipitiya West', 'Ritigahayaya', 'Thalwatta', 'Meemanakoladeniya', 'Siyambalamuraya', 'Udawelmulla', 'Siyarapitiya', 'Keselwatta', 'Udagomadiya', 'Bengamukanda', 'Dangalakanda', 'Rukmalpitiya', 'Gallindamulla', 'Katuwana', 'Pangamvilayaya', 'Ulahitiyawa West', 'Ulahitiyawa', 'Ulahitiyawa East', 'Andalugoda', 'Mellaketigoda', 'Araboda', 'Horavinna', 'Hediwatta', 'Weerakkuttigoda', 'Ranasingoda', 'Obadagahadeniya', 'Wathukanda', 'Kongasthenna', 'Galpothukanda', 'Ambagahahena', 'Karametiya', 'Puwakgasara', 'Binthenna', 'Bukendayaya', 'Walgammulla'] 
      },
      { 
        name: 'Okewela', 
        gnDivisions: ['Kanumuldeniya North', 'Olu Ara', 'Kanumuldeniya West', 'Kanumuldeniya East', 'Udadeniya', 'Kurunduwatta', 'Sumihirigama', 'Rajapuragoda', 'Wijayasiripura', 'Morakandegoda', 'Kadigamuwa East', 'Pahala Thalahagamwaduwa', 'Ihala Thalahagamwaduwa', 'Nathuwala', 'Kandebedda', 'Godawenna', 'Kahatellagoda', 'Kanumuldeniya South', 'Kadigamuwa West', 'Wawwa', 'Modarawana North', 'Modarawana South', 'Okawela', 'Heenatihathmuna', 'Palle Wawwa', 'Yatigala Pahala', 'Yatigala Ihala'] 
      },
      { 
        name: 'Beliatta', 
        gnDivisions: ['Maligathenna', 'Udugalmotegama', 'Pallattara West', 'Pallattara South', 'Pallattara East', 'Nugewela', 'Ihala Beligalla East', 'Wadiya', 'Ihala Beligalla West', 'Beligalla North', 'Beligalla South', 'Dammulla East', 'Dammulla West', 'Pattiyawela', 'Tharaperiya', 'Nihiluwa West', 'Indiketiyagoda', 'Nihiluwa East', 'Waharakgoda North', 'Waharakgoda South', 'Kahawatta', 'Kosgahagoda', 'Agulmaduwa', 'Aranwela North', 'Karambaketiya', 'Galwewa', 'Godawela', 'Panamulla', 'Ambagasdeniya', 'Getamanna North', 'Eldeniya', 'Getamanna West', 'Getamanna East', 'Mahaheella East', 'Kambussawala West', 'Kambussawala East', 'Beliatta West', 'Beliatta Town', 'Puwakdandawa North', 'Puwakdandawa East', 'Aranwela West', 'Sitinamaluwa West', 'Sitinamaluwa North', 'Sitinamaluwa East', 'Sitinamaluwa South', 'Pahalagoda', 'Medagoda', 'Beliatta South', 'Kudaheela East', 'Kudaheela North', 'Mahaheella West', 'Mahaheella North', 'Getamanna South', 'Nayakawatta', 'Ambala North', 'Ambala West', 'Miriswatta', 'Kudaheela South', 'Ovilana', 'Mihindupura', 'Palapotha East', 'Palapotha West', 'Dedduwawala East', 'Dedduwawala', 'Galagama North', 'Galagama West', 'Galagama South', 'Galagama East', 'Nakulugamuwa North', 'Wewdaththa', 'Nakulugamuwa West'] 
      },
      { 
        name: 'Tangalle', 
        gnDivisions: ['Sudarshanagama', 'Pattiyapola West', 'Thalunna', 'Andupalana', 'Kadiragoda', 'Gotaimbaragama', 'Kattakaduwa North', 'Kattakaduwa South', 'Ranna East', 'Ranna West', 'Vigamuwa', 'Pattiyapola East', 'Pattiyapola South', 'Vitharandeniya North', 'Thenagama South', 'Thenagama North', 'Thalapitiyagama', 'Athgalmulla', 'Uduwilagoda', 'Vitharandeniya south', 'Aluthgoda', 'Palathuduwa', 'Marakolliya', 'Medagama', 'Netolpitiya North', 'Netolpitiya South', 'Wadigala', 'Kahandawa', 'Nidahasgama West', 'Nidahasgama East', 'Kahandamodara', 'Gurupokuna', 'Wella Odaya', 'Rekawa East', 'Rekawa West', 'Medilla', 'Walgameliya', 'Godawanagoda', 'Wagegoda', 'Nalagama East', 'Siyambalagoda', 'Nalagama West', 'Polommaruwa North', 'Danketiya', 'Medaketiya', 'Kotuwe Goda', 'Indipokunagoda North', 'Polommaruwa South', 'Kadurupokuna East', 'Indipokunagoda South', 'Pallikkudawa Urban', 'Pallikkudawa Rural', 'Kadurupokuna South', 'Kadurupokuna North', 'Kadurupokuna West', 'Seenimodara West', 'Seenimodara East', 'Unakooruwa West', 'Unakooruwa East', 'Moraketiara East', 'Moraketiara West', 'Pahajjawa', 'Mahawela', 'Ihalagoda', 'Nakulugamuwa South', 'Kudawella North', 'Kudawella Central', 'Kudawella East', 'Mawella South', 'Mawella North', 'Kudawella South', 'Kudawella West'] 
      },
      { 
        name: 'Walasmulla', 
        gnDivisions: ['rammala', 'Saputhanthrikanda', 'Warapitiya', 'Keradeniya', 'Haggithakanda North', 'Konkarahena', 'Mapitakanda', 'Radaniara', 'Namaneliya', 'Udahagoda', 'Weedikanda', 'Galwadiya', 'Uda Julampitiya', 'Julampitiya', 'Palle Julampitiya', 'Pahalaobada', 'Bowala North', 'Bowala West', 'Welandagada', 'Batagassa', 'Pahalawaththa', 'Pathegama', 'Thalapathkanda', 'Dehigahahena', 'Weedapola', 'Mathuwakanda', 'Handugala', 'Kebellaketiya', 'Egodabedda', 'Kekiriobada', 'Agalabada', 'Bowala South', 'Muruthawela Ihala', 'Muruthawela Pahala', 'Galahitiya North', 'Omara East', 'Omara West', 'Athpitiya', 'Waththehengoda', 'Horewela', 'Pissubedda', 'Medagamgoda', 'Yahalmulla', 'Walasmulla Upper', 'Walasmulla Lover', 'Galahitiya South', 'Galahitiya East', 'Koholana', 'Walasmulla East', 'Walasmulla North', 'Walasmulla West', 'Walasmulla South', 'Daluwakgoda'] 
      },
    ]
  },
  'Jaffna': {
    province: 'Northern',
    divisionalSecretariats: [
      { 
        name: 'Island North (Kayts)', 
        gnDivisions: ['Analativu North', 'Analaitivu South', 'Eluvaitivu', 'Paruthiyadaippu', 'Kayts', 'Karampon', 'Karampon East', 'Naranthanai North West', 'Naranthanai North', 'Naranthanai', 'Naranthanai South', 'Karampon South East', 'Karampon West', 'Puliyankoodal', 'Suruvil'] 
      },
      { 
        name: 'Valikamam West (Chankanai)', 
        gnDivisions: ['Vadducoddai East', 'Vadducoddai North', 'Sangarathai', 'Araly West', 'Araly Centre', 'Araly South', 'Araly East', 'Arali North', 'Vedducoddai South', 'Vadducoddai South West (North)', 'Vadducoddai West', 'Tholpuram East', 'Tholpuram West', 'Ponnalai', 'Moolai', 'Chulipuram West', 'Chulipuram Centre', 'Chulipuram East', 'Pannagam', 'Panfippulam', 'Sithankerny', 'Chankanai East', 'Chankanai West', 'Chankanai South', 'Chankanai Centre'] 
      },
      { 
        name: 'Valikamam South-West (Sandilipay)', 
        gnDivisions: ['Suthumalai North', 'Suthumalai South', 'Savalkaddu', 'Uyarappulam', 'Ana icoddai', 'Navali North', 'Navaly East', 'Navali South', 'Manipay North', 'Manipay East', 'Manipay South', 'Manipay West', 'Sandilipay North', 'Sandilipay Centre', 'Sandilipay West', 'Mahiyappiddy', 'Vadaliyadaippu', 'Pandaththarippu', 'Piranpattu', 'Si lalai North', 'S ilalai South', 'Mathagal East', 'Mathagal South', 'Mathagal West', 'Periyavilan', 'Maresankoodal', 'Ilavalai', 'Mullanai'] 
      },
      { 
        name: 'Valikamam North (Tellipallai)', 
        gnDivisions: ['Mallakam South', 'Mallakam Centre', 'Mallakam North', 'Alavedy North', 'Alaveddy Centre', 'Alaveddy East', 'Ganeswaram', 'Alaveddy South', 'Alaveddy West', 'Ilavalai North', 'Ilavalai North West', 'Vithahapuram', 'Pannalai', 'Kollankaladdy', 'Naguleswaram', 'Tellippalai East', 'Tellippalai', 'Thurkkapuram', 'Thanthai Chelvapuram', 'Maviddapuram', 'Maviddapuram South', 'Kankesanthurai West', 'Kankesanthurai Centre', 'Kankesanthurai South', 'Palai Veemankamam North', 'Palai Veemankamam South', 'Kadduvan', 'Kadduvan West', 'Thenmaylai', 'Varuththalaivilan', 'Kurumpasiddy', 'Kurumpasiddy East', 'Vasavilan East', 'Vasavilan West', 'Myliddy North', 'Thaiyiddy East', 'Myliddithurai South', 'Thaiyiddy North', 'Thaiyiddy South', 'Myliddythurai North', 'Palaly South', 'Palaly East', 'Palaly North', 'Palaly North West', 'Palaly West'] 
      },
      { 
        name: 'Valikamam South (Uduvil)', 
        gnDivisions: ['Uduvil South West', 'Uduvil South East', 'Uduvil Centre', 'Uduvil Centre North', 'Uduvil North', 'Sanguvely', 'Inuvil South West', 'Inuvil East', 'Inuvil North East', 'Inuvil West', 'Thavady South', 'Thavady East', 'Thavady North', 'Chunnakam Town North', 'Chunnakam Town South', 'Chunnakam Town East', 'Chunnakam Town Centre', 'Chunnakam Town West', 'Kantharodai', 'Earlalai West', 'Earlalai South West', 'Earlalai South', 'Earlalai East', 'Earlalai North', 'Earlalai Centre', 'Punnalaikadduvan South', 'Punnalaikadduvan North', 'Evinai', 'Kuppilan South', 'Kuppilan North'] 
      },
      { 
        name: 'valikamam-East(kopayi)', 
        gnDivisions: ['Irupalai South', 'Irupalai East', 'Kalviyankadu', 'Kopay South', 'Kopay Center', 'Kopay North', 'Urumpirai West', 'Urumpirai North', 'Urumpirai South', 'Urumpirai East', 'Urelu', 'Neervely South', 'Neervely North', 'Neervely West', 'Siruppiddy East', 'Siruppiddy West', 'Puttur West', 'Puttur North', 'Navakkiri', 'Avaranhal East', 'Avarankal West', 'Puttur East', 'Achchelu', 'Watharawaththai', 'Paththaimeny', 'Thampalai Kathirippai', 'Idaikaddu', 'Valalai', 'Atchuvely North', 'Atchuvely South', 'Atchuvely West'] 
      },
      { 
        name: 'Vadamaradchy South-West, Karaveddy', 
        gnDivisions: ['Karanavai South', 'Karanavai West', 'Karanavai', 'Karanavai East', 'Uduppidy', 'Uduppidy North', 'Uduppidy South', 'Valvetty', 'Valvetty Centre', 'Samarabahu', 'Imayanan', 'Imayanan West', 'Karanavai North', 'Karanavai North West', 'Karanavai Centre', 'Karaveddy West', 'Karaveddy North', 'Karaveddy South', 'Maththony', 'Karaveddy Centre', 'Karaveddy East', 'Kaddaiveli', 'Thunnalai South', 'Thunnalai East', 'Thunnalai', 'Thunnalai Centre', 'Thunnalai West', 'Nelliaddy North', 'Nelliady', 'Nelliady East', 'Alvai', 'Alvai South', 'Alvai East', 'Aththai', 'Kapputhu'] 
      },
      { 
        name: 'Vadamaradchi East (Maruthnkerny)', 
        gnDivisions: ['Manalkadu', 'Kudaththanai', 'Kudathanai Karaiyoor', 'Potpathy', 'Ampan', 'Nagar Kovil East', 'Nagar Kovil West', 'Nagar Kovil South', 'Chempiyanpattu North', 'Chempianpattu South', 'Maruthankerny', 'Vathirayan', 'Uduththurai', 'Aliyavalai', 'Vetrilaikerny', 'Mullian', 'Pokkaruppu', 'Chundikulam'] 
      },
      { 
        name: 'Vadamaradchi North (Point Pedro)', 
        gnDivisions: ['Thondamanaru South', 'Thondamanaru North', 'Kerudavil South', 'Kerudavil North', 'Kerudavil East', 'Valvettithurai North West', 'Valvettiturai North Centre', 'Valvettiturai North East', 'Valvettithurai South West', 'Valvettiturai South East', 'Polikandy West', 'Polikandy East', 'Polikandy South', 'Alvai West', 'Alvai North West', 'Alvai North Centre', 'Viyaparimoolai', 'Alvai North', 'Point Pedro', 'Point Pedro South', 'Point Pedro East', 'Thumpalai', 'Thumpalai East', 'Katkovalam', 'Puloly North', 'Puloly North East', 'Puloly Centre', 'Puloly West', 'Puloly South West', 'Puloly North West', 'Puloly East', 'Puloly South', 'Manthikai', 'Vallipuram', 'Thunnalai North'] 
      },
      { 
        name: 'Thenmaradchi (Chavakachcheri)', 
        gnDivisions: ['Kaithady North', 'Kaithady East', 'Kaithady Centre', 'Kaithady South', 'Kaithady South East', 'Kaithady West', 'Navatkuli West', 'Navatkuli East', 'Kovilakkandy', 'Kaithady Navatkuli', 'Maravanpulo', 'Thanankalappu', 'Chavakachcheri Town', 'Kovilkudiiruppu', 'Sangaththanai', 'Chavakachcheri North', 'Manduvil', 'Kalvayal', 'Nunavil East', 'Nunavil Centre', 'Nunavil West', 'Kaithady Nunavil', 'Then Madduvil', 'Madduvil Nunavil', 'Madduvil Centre', 'Madduvil North', 'Madduvil East', 'Chandrapuram', 'Sarasalai South', 'Sarasalai North', 'Meesalai North', 'Meesalai West', 'Ramavil', 'Meesalai East', 'Allarai', 'Vellampokkadi', 'Kachchai', 'Palavi', 'Kodikamam North', 'Kodikamam Centre', 'Kodikamam South', 'Usan', 'Karampagam', 'Vidaththtpalai', 'Ketpely', 'Eluthumadduval South', 'Eluthumadduval North', 'Mirusuvil North', 'Mirusuvil South', 'Kudamiyan', 'Navatkadu', 'Varani North', 'Masery', 'Idaikkurichchi', 'Karambaikurichchi', 'Varani Iyattalai', 'Thavalai Iyattalai', 'Manthuvil East', 'Manthuvil West', 'Manthuvil North'] 
      },
      { 
        name: 'Nallur', 
        gnDivisions: ['Ariyalai South West', 'Ariyalai East', 'Ariyalai North West', 'Ariyalai Center West', 'Ariyalai South West(East)', 'Ariyalai Centre North', 'Ariyalai Centre', 'Ariyalai Center South', 'Iyanar Kovilady', 'Vannarpannai North', 'Vannarponnai North West', 'Vannarpannai North East ( Part )', 'Vannarponnai N.E. (South)', 'Kantharmadam North West', 'Kantharmadam North East (Part)', 'Kantharmadam South West', 'Kantharmadam South East', 'Nallur North', 'Nallur Rajadaniya', 'Nallur South', 'Sangiliyanthoppu', 'Thirunelvelly West', 'Thirunelvely Centre South', 'Thirunelvely South East', 'Thirunelve ly North East', 'Thirunelvelly Centre North', 'Kondavil North West', 'Kondavil South West', 'Kondavil Centre West', 'Kondavil Centre East', 'Kondavil North East', 'Kondavil South East', 'Kokuvil North East', 'Kokuvil East', 'Kokuvil South East', 'Kokuvil North West', 'Kokuvil West', 'Kokuvil Centre East', 'Kokuvil South West', 'Kokuvil Centre West'] 
      },
      { 
        name: 'Jaffna', 
        gnDivisions: ['Nedunkulam', 'Columbuthurai East', 'Columbuthurai West', 'Passaiyoor East', 'Passaiyoor West', 'Eachchamoddai', 'Thirunagar', 'Reclamation East', 'Reclamation West', 'Gurunagar East', 'Gurunagar West', 'Small Bazaar', 'Jaffna Town West', 'Jaffna Town East', 'Chundikuly South', 'Chundikuly North', 'Maruthady', 'Aththiady', 'Sirampiyady', 'Grand Bazaar', 'Fort', 'Vannarpannai', 'Koddady', 'Navanthurai South', 'Navanthurai North', 'Moor Street South', 'Moor Street North', 'New Moor Street'] 
      },
      { 
        name: 'Island South ,Velanai', 
        gnDivisions: ['Mandaitivu East', 'Mandaitivu West', 'Mandaitivu South', 'Allaipiddy', 'Mankumpan', 'Velanai North', 'Velanai North East', 'Velanai East', 'Velanai South East', 'Velanai Center East', 'Velanai South', 'Velanai center west', 'Velanai West', 'Saravanai East', 'Saravanai West', 'Pungudutivu North East', 'Pungudutivu East', 'Pungudutivu South East', 'Pungudutivu East South', 'Pungudutivu South', 'Pungudutivu North', 'Pungudutivu Centre North', 'Pungudutivu South West', 'Pungudutivu Centre west', 'Pungudutivu Centre East', 'Pungudutivu North West', 'Pungudutivu West', 'Nainativu North', 'Nainativu Center', 'Nainativu South'] 
      },
      { 
        name: 'Delft', 
        gnDivisions: ['Delft West', 'Delft South', 'Delft Centre West', 'Delft Centre', 'Delft Center East', 'Delft East'] 
      },
      { 
        name: 'Karainagar', 
        gnDivisions: ['Karainagar North', 'Karainagar North East', 'Karainagar East', 'Karainagar Centre', 'Karainagar North West', 'Karainagar West', 'Karainagar South East', 'Karainagar South', 'Karainagar South West'] 
      },
    ]
  },
  'Mannar': {
    province: 'Northern',
    divisionalSecretariats: [
  {
    name: "Mannar Town",
    gnDivisions: [
      "Talaimannar Village North",
      "Talaimannar Pier West",
      "Talaimannar Pier East",
      "Taliamannar",
      "Talaimannar Village South",
      "Kaddukaran Kudiyiruppu",
      "Thullukudiyiruppu",
      "Pesalai South",
      "Pesalai North",
      "Pesalai West",
      "Siruthoppu",
      "Periya Karisal",
      "Olaithodduwai",
      "Puthukudiyiruppu",
      "Erukkalampiddy West",
      "Erukkalampiddy North",
      "Erukkalampiddy East",
      "Erukkalampiddy South",
      "Erukkalampiddy Central",
      "Pallimunai East",
      "Moor Street",
      "Emil Nagar",
      "Tharapuram East",
      "Tharapuram West",
      "Thoddavely",
      "Thalvupadu",
      "Paddithottam",
      "Eluthoor",
      "South Bar",
      "Shavatkaddu",
      "Sinnakadai",
      "Uppukulam North",
      "Pallimunai West",
      "Uppukulam South",
      "Periyakadai",
      "Pettah",
      "Panankaddukoddu West",
      "Panankaddukoddu East",
      "Periyanavatkulam",
      "Thiruketheeswaram",
      "Nagathalvu",
      "Neelasenai",
      "Mathoddam",
      "Kallikaddaikadu",
      "Vannamoddai",
      "Uyilankulam",
      "Puthukamam",
      "Uyirtharasankulam",
      "Parappankandal"
    ]
  },
  {
    name: "Manthai West",
    gnDivisions: [
      "Thevanpiddy",
      "Vellankulam",
      "Pali Aru",
      "Anthoniyarpuram",
      "Illuppaikadavai",
      "Kalliyadi",
      "Aththimoddai",
      "Koorai",
      "Periyamadhu East",
      "Periyamadhu West",
      "Kayanagar",
      "Pallamadhu",
      "Kovitkulam",
      "Vidataltivu North",
      "Vidataltivu West",
      "Vidataltivu Central",
      "Vidataltivu East",
      "Pappamoddai",
      "Parappukadanthan West",
      "Parappukadanthan East",
      "Kannady",
      "Minukkan",
      "Maligaithiddal",
      "Veddayarmurrippu",
      "Adampan",
      "Nedunkandal",
      "Karunkandal Vannakulam",
      "Alkaddively",
      "Andankulam",
      "Karunkandal",
      "Sornapuri",
      "Palaikuly",
      "Kaththankulam",
      "Vaddakandal",
      "Palayadip Puthukulam",
      "Palai Periymalkaddu"
    ]
  },
  {
    name: "Madhu",
    gnDivisions: [
      "Palampiddy",
      "Keerisuddan",
      "Parasankulam",
      "Vilaththikulam",
      "Kakkayankulam East",
      "Kalmadhu",
      "Kakkayankulam West",
      "Iranai Illuppaikulam",
      "Periya Pandivirichchan East",
      "Periya Pandivirichchan West",
      "Madhu",
      "Maluvarayar Kaddaiadampan",
      "Poomalarnthan",
      "Thekkam",
      "Pannavedduvan",
      "Periyamurippu",
      "Mathakiramam"
    ]
  },
  {
    name: "Nanaddan",
    gnDivisions: [
      "Vankalai North",
      "Vankalai West",
      "Vankalai East",
      "Thomaspuri",
      "Naruvilikkulam",
      "Vanchiyankulam",
      "Ilahadipiddy",
      "Ilanthaimoddai",
      "Periyakkaddaikadu",
      "Aththikuly",
      "Kanchchiththalvu",
      "Chemmantivu",
      "Murunkan",
      "Cheddiarmagan Kaddaidampan",
      "Iraddaikulam",
      "Chundikuly",
      "Puthirarkandan",
      "Razool Puthuvely",
      "Nanaddan",
      "Umanagiri",
      "Achchankulam",
      "Moddaikadai",
      "Rasamadhu",
      "Pallankoddai",
      "Valkaipettankandal",
      "Pontheevukandal",
      "Kalimoddai Puliyankulam",
      "Pariharikandal",
      "Sirukkandal",
      "Katkidanthakulam",
      "Isamalaithalvu"
    ]
  },
  {
    name: "Musalai",
    gnDivisions: [
      "Arippu West",
      "Arippu East",
      "Methanvely",
      "Poonochikulam",
      "Pandaravely",
      "Sinna Pullachchi Potkerny",
      "Periya Pullachchi Potkerny",
      "Veppankulam",
      "Maruthamadhu",
      "Ahathymurippu",
      "Puthuvely",
      "Saveriyarpuram",
      "Chilavathurai",
      "Koolankulam",
      "Kondachchi",
      "Kokkupadayan",
      "Palaikuly",
      "Karadikkuly",
      "Mullikulam",
      "Marichchukaddy"
    ]
  }
]
  },
  'Vavuniya': {
    province: 'Northern',
    divisionalSecretariats: [
      { 
        name: 'Vavuniya North', 
        gnDivisions: ['Unchalkaddy', 'Vedivaithakallu', 'Maruthodai', 'Paddikudiyiruppu', 'Katkulam', 'Nedunkerny South', 'Nedunkerny North', 'Olumadu', 'Mamadu', 'Kulavisuddan', 'Maraillupai', 'Paranthan', 'Anantha Puliyakulam', 'Sinnadampan', 'Nainamadu', 'Puliyankulam South', 'Puliyankulam North', 'Kanakarayankulam South', 'Kanakarayankulam North', 'Mannakulam'] 
      },
      { 
        name: 'Vavuniya South', 
        gnDivisions: ['Periya Ulukkulama', 'Poomaduwa', 'Rankethgama', 'Maruthammaduwa', 'Track 7', 'Awaranthulawa', 'Acre 20, 40, 60', 'Acre 400', 'Madukanda', 'Eramperiyakulama', 'Alagalla', 'Avusadapitiya', 'Kalukunnamaduwa', 'Nedunkulama', 'Mahamailankulama', 'Mamaduwa', 'Mahakachchakodiya', 'Pudubulankulama', 'Pirappamaduwa', 'Agbopura'] 
      },
      { 
        name: 'Vavuniya', 
        gnDivisions: ['Palamoddai', 'Maruthamadu', 'Panrikeythakulam', 'Arumugaththanputhukkulam', 'Semamadu', 'Maligai', 'Mahilankulam', 'Maruthankulam', 'Elamaruthankulam', 'Kallikkulam', 'Nochchimoddai', 'Paranaddakal', 'Puthukkulam', 'Marekkarampalai', 'Thandikulam', 'Maharambaikkulam', 'Kaththarsinnakulam', 'Nelukkulam', 'Pattanichchoor Puliyankulam', 'Vavuniya Town', 'Omanthai', 'Salambaikkulam', 'Sasthirikoolankulam', 'Echchankulam', 'Kalmadu', 'Poovarasankulam', 'Sekkadipulavu', 'Pambaimadu', 'Rajendrankulam', 'Koomankulam', 'Kovilkulam', 'Velikkulam', 'Moonrumurippu', 'Kandapuram', 'Thonikkal', 'Samalankulam', 'Asikulam', 'Rambaikulam', 'Vairavapuliyankulam', 'Pandarikulam', 'Vavuniya Town North', 'Velankulam'] 
      },
      { 
        name: 'Vengalacheddikulam', 
        gnDivisions: ['Andiyapuliyankulam', 'Periyathampanai', 'Periyakaddu', 'Kannaddy', 'Piramanalankulam', 'Sooduventhapulavu', 'Kurukkalputhukkulam', 'Kanthasamy Nagar', 'Unit 05 / 06 Pavatkulam', 'Pavatkulam Unit - 04', 'Pavatkulam Unit - 02', 'Muthaliyarkulam', 'Sinnasippikulam', 'Neriyakulam', 'Periyapuliyalankulam', 'Cheddikulam', 'Mugaththankulam', 'Pavatkulam Unit 09 & 10', 'Kiristhavakulam', 'Kangankulam'] 
      },
    ]
  },
  'Mullaitivu': {
    province: 'Northern',
    divisionalSecretariats: [
      { 
        name: 'Thunukkai', 
        gnDivisions: ['Alankulam', 'Amaithipuram', 'Ampalapperumalkulam', 'Anichchiyankulam', 'Barathinagar', 'Iyankankulam', 'Kalvilan', 'Koddaikaddiyakulam', 'Mallavi', 'Palayamurikandy', 'Pugalenthinagar', 'Puththuvedduvan', 'Thenniyankulam', 'Therankandal', 'Thirunagar', 'Thunukkai', 'Uyilankulam', 'Yogapuram Centre', 'Yogapuram East', 'Yogapuram West'] 
      },
      { 
        name: 'Manthai East', 
        gnDivisions: ['Ampalpuram', 'Karumpulliyan', 'Kollavilankulam', 'Moonrumurippu', 'Naddankandal', 'Oddaruththakulam', 'Palinagar', 'Pandiyankulam', 'Ponnagar', 'Poovarasankullam', 'Selvapuram', 'Siraddikulam', 'Sivapuram', 'Vannivilankulam', 'Vinayagapuram'] 
      },
      { 
        name: 'Puthukudiyiruppu', 
        gnDivisions: ['Ananthapuram', 'Iranaipalai', 'Kombavil', 'Mallikaitheevu', 'Manikkapuram', 'Mannakandal', 'Manthuvil', 'Puthukkudiyiruppu East', 'Puthukkudiyiruppu West', 'Sivanagar', 'Suthanthirapuram', 'Theravil', 'Thevipuram', 'Udaiyarkaddu North', 'Udaiyarkaddu South', 'Vallipunam', 'Valluvarpuram', 'Visvamadu East', 'Visuvamadu West'] 
      },
      { 
        name: 'Oddusuddan', 
        gnDivisions: ['Ampagamam', 'Ganesapuram', 'Ithupuram', 'Kanakaradnapuram', 'Karuvalankandal', 'Kachchilaimadu', 'Kathaliyarsamalankulam', 'Koolamurippu', 'Manavalanpaddamurippu', 'Mankulam', 'Muththaiyankaddukulam', 'Muththuvinayakapuram', 'Oddusuddan', 'Olumadu', 'Othiyamalai', 'Palampasi', 'Pandaravanni', 'Panikkankulam', 'Peraru', 'Periyaiththimadu', 'Periyakulam', 'Puliyankulam', 'Thachchadampan', 'Thanduvan', 'Thaddayamalai', 'Thirumurukandy', 'Vithiyapuram'] 
      },
      { 
        name: 'Maritimepattu', 
        gnDivisions: ['Alampil North', 'Alampil South', 'Ampalavanpokkanai', 'Semmalai', 'Chemmalai East', 'Chilawattai', 'Silawaththai South', 'Keekkirapuram', 'Kallappadu North', 'Kallappadu South', 'Kanukkerni East', 'Kanukkerni West', 'Karunaddukkerny', 'Keppapilavu', 'Kokkulai East', 'Kokkulai West', 'Kokkuththoduvai Centre', 'Kokuthoduvai North', 'Kokkuththoduvai South', 'Kovilkudiyiruppu', 'Kumarapuram', 'Kumulamunai Centre', 'Kumulamunai East', 'Kumulamunai West', 'Mamoolai', 'Manalkudiyiruppu', 'Mathavalasingankulam', 'Mullaitivu South', 'Mullaitivu Town', 'Mullivaikkal East', 'Mullivaikkal West', 'Mulliyawalai Centre', 'Mulliyawalai East', 'Mulliyawalai North', 'Mulliyawalai South', 'Mulliyawalai West', 'Neeravipiddy East', 'Neeravipiddy West', 'Putharikuda', 'Selvapuram', 'Thannimurippu', 'Thanniyoottu East', 'Thaniyoottu West', 'Uppumaveli', 'Vannankulam', 'Vattappalai'] 
      },
      { 
        name: 'Welioya', 
        gnDivisions: ['Kalyanipura', 'Kiriebbanwewa', 'Nikawewa - South', 'Ahatugaswewa', 'Ethawatunu wewa', 'Nikawewa - Left', 'New Gajabhapura', 'Janakapura', 'Gajabhapura'] 
      },
    ]
  },
  'Killinochchi': {
    province: 'Northern',
    divisionalSecretariats: [
      { 
        name: 'Pachchilaipalli', 
        gnDivisions: ['Allipallai', 'Arasarkerni', 'Ittavil', 'Iyakachchi', 'Kachcharveli', 'Kilali', 'Kovilvayal', 'Masar', 'Mugamalai', 'Mugavil', 'Mullaiyady', 'Pallai Town', 'Pulopallai', 'Pulopallai West', 'Soranpattu', 'Thambagamam', 'Tharmakerny', 'Vembodukerny'] 
      },
      { 
        name: 'Kandavalai', 
        gnDivisions: ['Elephant Pass', 'Kalmadunagar', 'Kandawalai', 'Korakkankaddu', 'Kumarapuram', 'Murasumoddai', 'Paranthan', 'Periyakulam', 'Piramanthanaru', 'Puliyampokkanai', 'Puthiya Punnaineeravi', 'Thadduvankoddy', 'Tharmapuram East', 'Tharmapuram West', 'Umaiyalpuram', 'Uriyan'] 
      },
      { 
        name: 'Karachchi', 
        gnDivisions: ['Akkarayan kulam', 'Ampalkulam', 'Ampalnakar', 'Anaivilunthaankulam', 'Ananthapuram', 'Civic Center', 'Jeyanthinagar', 'Kanagambikaykulam', 'Kanagapuram', 'Ganeshapuram', 'Kannakai puram', 'Kili Town', 'Konavil', 'Krishnapuram', 'Malaiyalapuram', 'Maruthanakar', 'Mavadiyamman', 'Mayavanoor', 'Pannankandy', 'Barathi puram', 'Periya Paranthan', 'Ponnagar', 'Puthumurippu', 'Ramanathapuram', 'Rathinapuram', 'Selvanakar', 'Sivanakar', 'Skantha puram', 'Thirunagar North', 'Thirunagar South', 'Thiruvaiyaru', 'Thiruvaiyaru West', 'Thondamannagar', 'Uruthirapuram East', 'Uruththiram puram North', 'Uruthirapuram West', 'Uthayanagar East', 'Uthayanagar West', 'Uttupulam', 'Vaddakachchi', 'Vannerikulam', 'Vivegananthanagar'] 
      },
      { 
        name: 'Poonakary', 
        gnDivisions: ['Alankerny', 'Cheddiyakurichchi', 'Gnanimadam', 'Iranaitivu', 'Jayapuram North', 'Jeyapuram South', 'Kariyalainagapaduvan', 'Kiranchi', 'Kollakuruchchi', 'Gowtharimunai', 'Madduvilnadu East', 'Madduvilnadu West', 'Mulankavil', 'Nachchikuda', 'Nallur', 'Pallavarayankaddu', 'Pallikuda', 'Paramankirai', 'Ponnaveli'] 
      },
    ]
  },
  'Batticaloa': {
    province: 'Eastern',
    divisionalSecretariats: [
      { 
        name: 'Koralai Pattu North', 
        gnDivisions: ['Kathiravely', 'Ammanthanavely', 'Puchchakerny', 'Palchenai', 'Vakarai North', 'Uriyankaddu', 'Kaddumurivu', 'Vakarai Central', 'Panichchankerni', 'Mathurankernikulam', 'Punanai East', 'Kirmichai', 'Mankerny Central', 'Mankerny South', 'Kayankerny', 'Vattavan'] 
      },
      { 
        name: 'Koralai Pattu West (Oddamavadi)', 
        gnDivisions: ['Oddamavadi 01 South', 'Oddamavadi 02', 'Oddamavadi 03', 'Mancholai'] 
      },
      { 
        name: 'Koralai Pattu (Valachchenai)', 
        gnDivisions: ['Nasivanthivu - 205C', 'Valaichenai Tamil', 'Puthukudiyiruppu', 'Pethalai', 'Kalkuda', 'Kalmadu', 'Kannagipuram', 'Kumburumoolai', 'Sungankerny', 'Kanniyadi', 'Karuwakerni', 'Meeravodai Tamil'] 
      },
      { 
        name: 'Eravur Pattu', 
        gnDivisions: ['Siththandi 3', 'Siththandi 2', 'Siththandi 4', 'Siththandi I', 'Mavadivembu 2', 'Mavadivembu I', 'Kaluvankerny I', 'Kaluwankerny 2', 'Thalavai', 'Iyankerny', 'Kommathurai North', 'Palachcholai', 'Vantharumoolai East', 'Vantharumoolai West', 'Eralakkulam', 'Mayilavaddavan', 'Koduwamadu', 'Kommathurai West', 'Kommathurai East', 'Chenkalady 2', 'Chenkalady 1', 'Eravur 4', 'Pankudahvely', 'Veppavedduwan', 'Karadiyanaru', 'Koppavely', 'Periya pullumalai', 'Gamunupura', 'Eravur 5', 'Ellainagar'] 
      },
      { 
        name: 'Eravur Town', 
        gnDivisions: ['Eravur 02A', 'Meerakerny', 'Eravur 03', 'Eravur 03A', 'Eravur 02', 'Eravur 02B', 'Eravur 02C', 'Eravur 01B', 'Eravur 06D', 'Eravur 06', 'Mich Nagar', 'Iyankerny'] 
      },
      { 
        name: 'Manmunai North', 
        gnDivisions: ['Palameenmadu', 'Navalady', 'Amirthakali', 'Punnachcholai', 'Thiraimadu', 'Saththurukondan', 'Panichchayadi', 'Kokkuvil', 'Sinna Urane', 'Jayanthipuram', 'Karuweppankeney', 'Mamagam', 'Koolavady', 'Koolavadi East', 'Thamaraikerny', 'Periya Uppodai', 'Datch Bar', 'Thissaveerasingam Squre', 'Iruthayapuram East', 'Iruthayapuram Central', 'Iruthayapuram West', 'Periya Urani', 'Gnasooriyam Squre', 'Veddukkadu', 'Barathypuram', 'Thandavanvely', 'Arasady', 'Koddamunai', 'Kallady Mugathuvaram', 'Thiruchchenthur', 'Kallady', 'Kallady Veloor', 'Kallady Uppodai', 'Puliyanthivu East', 'Puliyanthivu Central', 'Puthunagar', 'Sethukudah', 'Veechikalmunai', 'Thimilathivu', 'Nochchimunai', 'Navatkudah', 'Navatkudah East', 'Navatkudah South'] 
      },
      { 
        name: 'Manmunai West', 
        gnDivisions: ['Mahilavedduwan', 'Karaveddy', 'Vilavedduwan', 'Navatkadu', 'Eachchantheivu', 'Mankikaddu', 'Vavunatheivu', 'Ayithiyamalai South', 'Ayithiyamalai North', 'Nediyamadu', 'Pavakkodichenai', 'Kurinchamunai', 'Paruthichenai', 'Kannankudah', 'Mandapathady', 'Karayakkanteivu', 'Puthumandapathady', 'Kanthinagar', 'Unnichchei', 'Panchenai', 'Ilupadichenai', 'Kothiyapulai', 'Kanchirankudah'] 
      },
      { 
        name: 'Kattankudy', 
        gnDivisions: ['Kattankudy Division 1', 'Kattankudy 1 south', 'Kattankudy 2', 'Kattankudy 2 North', 'New Kattankudy Div. North', 'New Kattankudy South', 'Kattankudy 3 East', 'Kattankudy 3', '165 A Div.3 West Kattankudy', 'Kattankudy 4 West', 'Division 04, Kattankudy', 'Kattankudy 6 south', 'New Kattankudy West', 'New Kattankudy East', 'Kattankudy Division 6 South', 'Kattankudy 6 west', 'Kattankudy 5', 'Div.05, South Kattankudy'] 
      },
      { 
        name: 'Manmunai Pattu (Arayampathy)', 
        gnDivisions: ['Kirankulam North', 'Kirankulam South', 'Kirankulam', 'Kirankulam Central', 'Puthukudiyiruppu', 'Puthukudiyiruppu South', 'Puthukudiyiruppu North', 'Palamunai', 'Thalankudah', 'Kankeyanodai South', 'Araipatti 03', 'Rajathurai Gramam', 'Araipatti Central', 'Araipatti 02', 'Selvanagar', 'Selvanagar East', 'Araipattay East', 'Arayampathy North', 'Arayampathy 01', 'Arayampathy West'] 
      },
      { 
        name: 'Manmunai South-West', 
        gnDivisions: ['Munaikadu East', 'Muthalaikkudah West', 'Muthalaikkudah', 'Mahiladithivu', 'Mahiladithivu South', 'Kokkadichcholai', 'Munaikkadu South', 'Kokkadichcholai South', 'Pandariyavelly', 'Arasaditivu North', 'Paddippalai', 'Kuluvinamadu', 'Arasaditivu', 'Kadukkamunai', 'Ampilanthurai North', 'Ampilanthurai', 'Ampilanthurai West', 'Katchenai', 'Mavadimunmaari', 'Thanthamalai', 'Kachchakodi', 'Panichchiyadimunmari'] 
      },
      { 
        name: 'Porativu Pattu', 
        gnDivisions: ['Selvapuram', 'Vammiyadiyoottu', 'Thumpankerny (Y.F.S.)', 'Kalumunthanvely', 'Kanthipuram', 'Mavetkudah', 'Vipulananthapuram', 'Paluhamam I', 'Palugamam 02', 'Vanninakar', 'Veeranchenai', 'Thumbankerny', 'Saravanaiyadiyoottu', 'Thikkodai', 'Navagirinagar', 'Kannapuram', 'Palayadivaddai', 'Nellikkadu', 'Vivekananthapuram', 'Vellaveli', 'Punnakulam', 'Kovilporativu West', 'Kovilporativu', 'Munaiththeevu', 'Pattapuram', 'Mandur 1 and 2 South', 'Mandur Kodamunai', 'Mandur 3', 'Mandur 1, 2 (North Part)', 'Palamunai', 'Thambalawaththai', 'Ganeshapuram', 'Sankarpuram', 'Palacholai', 'Kakkachchivattai', 'Kannapuram East', 'Vilanthoddam', 'Sinnawaththai', 'Malayarkaddu', 'Anaikaddiyaveli', 'Ranamadu'] 
      },
      { 
        name: 'Manmunai South & Eruvil Pattu', 
        gnDivisions: ['Kurukkalmadam North', 'Kurukkalmadam South', 'Cheddipalayam North', 'Cheddipalayam South', 'Mangkaadu', 'Thettaththatheevu North', 'Thettaththeevu South', 'Thettatheevu South -02', 'Thetthaththeevu South - 01', 'Kaluthavalai 01', 'Kaluthavalai Central', 'Kaluthavalai 02', 'Kaluthavalai 03', 'Kaluthavalai 04', 'Kaluthavalai 04 Santhipuram', 'Kaluwanchikudy North 1', 'Kaluwanchikudy North', 'Paddiruppu', 'Eruvil North', 'Kaluwanchikudy - South', 'Ondachchimadam North', 'Eruvil East', 'Kurumanvely 11 East', 'Kurumanvely - 12', 'Mahiloor West', 'Ondachchimadam South', 'Koddaikallar North', 'Koddaikallar West', 'Mahiloormunai', 'Koddaikallar East', 'Koddaikallar South', 'Periyakallar 01', 'Periyakallaru 01 South', 'Periyakallar 2 West', 'Periyakallaru 2', 'Periyakallar 3 South', 'Periyakallar 3', 'Thuraineelavanai North', 'Thuraineelavanai North - 01', 'Thuraineelavanai South', 'Thuraineelavanai South - 01'] 
      },
      { 
        name: 'Koralai Pattu South (Kiran)', 
        gnDivisions: ['Punanai West', 'Vahaneri', 'Muruththanai', 'Uthuchchenai', 'Kallichchai', 'Vadamunai', 'Kudumpimalai', 'Perillaveli', 'Poolakkadu', 'Kiran East', 'Kiran West', 'Korakallimadu', 'Santhiveli', 'Palaiyadithona', 'Devapuram', 'Murakkottanchenai', 'Thihikilivaddai', 'Koraveli'] 
      },
      { 
        name: 'Koralai Pattu Central', 
        gnDivisions: ['Valaichenai – 04', 'Bainthuraichenai (North)', 'Valaichenai – 05', 'Brainthuraichenai (South)', 'Mavadichenai', 'Semmanodai', 'Punanai (East)', 'Thiyawatthuwan', 'Valachchenai 5 (south)'] 
      },
    ]
  },
  'Ampara': {
    province: 'Eastern',
    divisionalSecretariats: [
      { 
        name: 'Dehiattakandiya', 
        gnDivisions: ['Ridee Ela', 'Bakmeedeniya', 'Dehiattakandiya', 'Serupitiya', 'Sadamadulla', 'Sandunpura', 'Paranagama', 'Ihalagama', 'Nawa Medagama', 'Wewmedagama'] 
      },
      { 
        name: 'Padiyathalawa', 
        gnDivisions: ['Serankada', 'Unapana', 'Hagamwela', 'Kirawana'] 
      },
      { 
        name: 'Mahaoya', 
        gnDivisions: ['Kelavinna', 'Dambadeniya', 'Kekirihena', 'Kudaharasgala'] 
      },
      { 
        name: 'Uhana', 
        gnDivisions: ['Nugelanda North', 'Nugelanda South', 'Bakkiella', 'Rajagalathenna South', 'Weeranketagoda', 'Senagama North', 'Senagama South', 'Gonagala', 'Kumarigama', 'Komariya', 'Udagirigama West', 'Udagirigama East', 'Galahitiyagoda', 'Mahakandiya', 'Kahatagasyaya', 'Welikahagolla', 'Weeragoda South', 'Dadayamthalawa West', 'Dadayamthalawa East', 'Vijayapura East'] 
      },
      { 
        name: 'Ampara', 
        gnDivisions: ['Namalthalawa', 'Namal Oya 02', 'Polwaga coloney', 'Wavinna North', 'Wavinna South', 'Namal Oya (i)'] 
      },
      { 
        name: 'Navithanvelly', 
        gnDivisions: ['Central Camp 01', 'Central Camp 02', 'Central Camp 03', 'Central Camp 05', 'Central Camp 06', 'Central Camp 04', 'Chalambaikeny 03', 'Chalampakeny 04', 'Chalampakeny 05', 'Chalampakeny 01', 'Chalambaikerny 02', 'Sorrikkalmunai 3', 'Sorrikkalmunai 1', 'Sorrikkalmunai 2', 'Chavalakade', 'Navithanveli 02', 'Annamalai 03', 'Annamalai 02', 'Navithanveli 01', 'Annamale 01'] 
      },
      { 
        name: 'Samanthurai', 
        gnDivisions: ['Veeramunai 04', 'Sammanthurai 08', 'Sammanthurai 06', 'Sammanthurai Tamil Div.01', 'Sammanthurai Tamil Div.04', 'Sammanthurai Tamil Div.02', 'Sammanthurai 01', 'Sammanthurai 02', 'Sammanthurai 05', 'Karuwaddukal 01', 'Sammanthurai 10', 'Sammanthurai 09', 'Sammanthurai 07', 'Sammanthurai 04', 'Sammanthurai Tamil Div.03', 'Maddakalaputharavai 02', 'Maddakalaputharavai 01', 'Sammanthurai 03', 'Veeramunai 03', 'Veeramunai 02', 'Veeramunai 01', 'Sammanthurai 12', 'Malwatte 02', 'Block \'J\' East 01', 'Block \'J\' West 02', 'Kallarichchel 02', 'Block \'J\' West 01', 'Kallarichchel 03', 'Udanga 01', 'Udanga 02', 'Vilinayadi 01', 'Sennelgramam 01', 'Sennelgramam 02', 'Vilinayadi 02', 'Vilinayadi 03', 'Kallarichchel 01', 'Valathapitty 02', 'Valathapitty 01', 'Malwatte 04'] 
      },
      { 
        name: 'Kalmunai', 
        gnDivisions: ['Periyaneelavanai Muslim Section 01', 'Periyaneelavanai Muslim Section 02', 'Maruthamunai 01', 'Maruthamunai 02', 'Maruthamunai 03', 'Maruthamunai 04', 'Maruthamunai 05', 'Maruthamunai 06', 'Natpittimanai Muslim Division 03', 'Natpittimunai Muslim Division 02', 'Natpittimunai Muslim Division 01', 'Natpittimunai Muslim Division 05', 'Natpittimunai Muslim Division 04', 'Islamabad & Kalmunai Town', 'Kalmunai Muslim Section', 'Kalmunaikudy 01', 'Kalmunaikudy 03', 'Kalmunaikudy 02', 'Kalmunaikudy 04', 'Kalmunaikudy 05', 'Kalmunaikudy 06', 'Kalmunaikudy 08', 'Kalmunaikudy 09', 'Kalmunaikudy 07', 'Kalmunaikudy 10', 'Kalmunaikudy 11', 'Kalmunaikudy 12', 'Kalmunaikudy 13', 'Kalmunaikudy 14', 'Pandirippu-1'] 
      },
      { 
        name: 'Sainthamarathu', 
        gnDivisions: ['Sainthamaruthu 1', 'Sainthamaruthu 2', 'Sainthamaruthu 3', 'Sainthamaruthu 4', 'Sainthamaruthu 5', 'Sainthamaruthu 12', 'Sainthamaruthu 17', 'Sainthamaruthu 14', 'Sainthamaruthu 15', 'Sainthamaruthu 16', 'Kalmunai-1'] 
      },
      { 
        name: 'Kalmunai North Sub Office', 
        gnDivisions: ['Kalmunai-1C', 'Kalmunai-1D', 'Kalmunai-1E', 'Kalmunai-2', 'Kalmunai-2A', 'Kalmunai-2B', 'Kalmunai-3', 'Kalmunai-3A', 'Pandirippu-1A', 'Pandirippu-2', 'Pandirippu-2A', 'Pandirippu-2B', 'Pandirippu-2C', 'Natpaddimunai TD 1', 'Natpaddimunai TD 2', 'Natpaddimunai TD 3', 'Chennaipendirippu-1', 'Chennaipendirippu-1A', 'Chennaipendirippu-1B', 'Periyaneelavanai-1', 'Periyaneelavanai-1A', 'Periyaneelavanai-1B'] 
      },
      { 
        name: 'Karaitivu', 
        gnDivisions: ['Karaitivu 11', 'Karaitivu 12'] 
      },
      { 
        name: 'Ninthavur', 
        gnDivisions: ['Nintavur 24', 'Nintavur 11', 'Nintavur 12', 'Nintavur 01', 'Nintavur 02', 'Nintavur 13', 'Nintavur 14', 'Nintavur 15', 'Nintavur 03', 'Nintavur 04', 'Nintavur 16', 'Nintavur 17', 'Nintavur 18', 'Nintavur 05', 'Nintavur 06', 'Nintavur 19', 'Nintavur 25', 'Nintavur 20', 'Nintavur 07', 'Nintavur 08', 'Nintavur 21', 'Nintavur 22', 'Nintavur 09', 'Nintavur 10', 'Nintavur 23'] 
      },
      { 
        name: 'Addalaichenai', 
        gnDivisions: ['Deegawapi-01', 'Oluvil 01', 'Oluvil 04', 'Oluvil 06', 'Oluvil 05', 'Oluvil 03', 'Oluvil 02', 'Palamunai-06', 'Oluvil 07', 'Palamunai-02', 'Palamunai-01', 'Palamunai 03', 'Palamunai-04', 'Palamunai 05', 'Addalaichenai 02', 'Addalaichenai 09', 'Addalaichenai 10', 'Addalaichenai 08', 'Addalaichenai 06', 'Addalaichenai 01', 'Addalaichenai 11', 'Addalaichenai 03', 'Addalaichenai 07', 'Addalaichenai 12', 'Addalaichenai 14', 'Addalaichenai 13', 'Addalaichenai 04', 'Addalaichenai 15', 'Addalaichenai 16', 'Addalaichenai 05', 'Addalaichenai 17', 'Deegawapiya 02'] 
      },
      { 
        name: 'Irakkamam', 
        gnDivisions: ['Irakkamam 07', 'Varipathanchenai 01', 'Irakkamam 02', 'Irakkamam 08', 'Irakkamam 09', 'Irakkamam 06', 'Irakkamam 01', 'Irakkamam 03', 'Varipathanchenai 03', 'Irakkamam 05', 'Irakkamam 04', 'Varipathanchenai 02'] 
      },
      { 
        name: 'Akkaraipattu', 
        gnDivisions: ['Alim Nagar', 'Issanganicheemai', 'Akkaraipattu-2', 'Akkaraipattu-3', 'Akkaraipattu-17', 'Akkaraipattu-18', 'Akkaraipattu-20', 'Akkaraipattu-21', 'Town Division-5', 'Town Division-4'] 
      },
      { 
        name: 'Alayadiwembu', 
        gnDivisions: ['Akkaraipattu 8/1', 'Akkaraipattu 9', 'Akkaraipattu 8/3', 'Akkaraipattu 8/2', 'Akkaraipattu 7/1', 'Akkaraipattu 7/2', 'Wachchikuda', 'Kannakikiramam 01', 'Aligambai', 'Akkaraipattu 7/4', 'Akkaraipattu 7/3', 'Akkaraipattu 7', 'Akkaraipattu 8', 'Sinnamugathuwaram', 'Kolavil 03', 'Navatkadu', 'Kolavil 02', 'Kolavil 01', 'Panamkadu', 'Sinnapanamkadu', 'Kannakikiramam 02', 'Alayadivembu'] 
      },
      { 
        name: 'Damana', 
        gnDivisions: ['Keenawatta', 'Muwangala', 'Galmaduwa', 'Uksiripura', 'Helagampura', 'Karalewa', 'Hingurana', 'Diviyagala', 'Padagoda', 'Koknahara', 'Moragahapallama', 'Damana', 'Alahena', 'Madawalalanda', 'Madana', 'Eggaloya', 'Kethsirigama', 'Galkanda', 'Pallanoya', 'Kivulegama', 'Thimbirigolla', 'Ambalanoya', 'Veheragala', '18A . Janapadaya', 'Thottama', 'Kumana', 'Wadinagala', 'Pannalgama', 'Bakmitiyawa'] 
      },
      { 
        name: 'Thirukkovil', 
        gnDivisions: ['Vinayagapuram04', 'Vinayagapuram-01', 'Vinayagapuram-02', 'Thirukkovil 4', 'Kanchirankuda', 'Kanchikudiyaru', 'Vinayagapuram-03', 'Sangamankiramam', 'Thandiyadi'] 
      },
      { 
        name: 'Pothuvil', 
        gnDivisions: ['Komari Unit 02', 'Komari unit 01', 'Kalappukattu'] 
      },
      { 
        name: 'Lahugala', 
        gnDivisions: ['Lahugala', 'Dewalagoda', 'Pansalgoda', 'Panama West', 'Shasthrawela', 'Panama Central', 'Panama North', 'Panama South'] 
      },
    ]
  },
  'Trincomalee': {
    province: 'Eastern',
    divisionalSecretariats: [
      { 
        name: 'Padavi Sri Pura', 
        gnDivisions: ['Sewajanapadaya', 'Gemunu Pura', 'Kavanthissa Pura', 'Lassana Gama', 'Singhapura', 'Paranamedawachchiya', 'Samanpura', 'Sri Thissapura', 'Sri Pura', 'Jayanthi Wewa'] 
      },
      { 
        name: 'Kuchchaveli', 
        gnDivisions: ['Thennamaravadi', 'Pulmoddai 03', 'Pulmoddai 02', 'Pulmoddai 01', 'Pulmoddai 04', 'Thiriyai', 'Senthoor', 'Kaddu kulam', 'Kallampaththai', 'Kuchchaveli', 'Iranaikkeni', 'Veerancholai', 'Jaya Nagar', 'Cassim Nagar', 'Kumburupitiya South', 'Kumburupitiya North', 'Kumburupitiya East', 'Nilaveli', 'Irakkandy', 'Gopalapuram', 'Veloor', 'Iqbal Nagar', 'Periyakulam', 'Valaiyuttu'] 
      },
      { 
        name: 'Gomarankadawala', 
        gnDivisions: ['Gomarankadawala', 'Kalyanapura', 'Galkadawala', 'Pamburugaswewa', 'Kandamalawa', 'Madawachchiya', 'Kivulakadawela', 'Pulikandykulama', 'Maila Wewa', 'Bakmeegama'] 
      },
      { 
        name: 'Morawewa', 
        gnDivisions: ['Penikatiyawa', 'Mahathulwewa', 'Mahadiwul Wewa Stage 02', 'Nochchikulam', 'Morawewa South', 'Morawewa North', 'Awwai Nagar', 'Namalwatta', 'Kitul Ultuwa', 'Morawewa Pankulama'] 
      },
      { 
        name: 'Trincomalee Town and Gravets', 
        gnDivisions: ['Vilgama', 'Velveri', 'Kanniya', 'Illapaikulam', 'Sampalthivu', 'Salli', 'Uppuveli', 'Puliyankulam', 'Varothyanagar', 'Peeliyadi', 'Mangaiyuthu', 'Andankulam', 'Singhapura', 'Kovilady', 'Palaiyoottu', 'Abayapura', 'Anpuvalipuram', 'Mihindupura', 'Selvanayagapuram', 'Jinnanagar', 'Murugapuri', 'Thirikkadaloor', 'Pattanatheru', 'Peruntheru', 'Sivapuri', 'Linganagar', 'Mudcove', 'Poompuhar', 'Sumedhankarapura', 'Muththunagar', 'Kappalthurai', 'Kavattikudah', 'Nachchikuda', 'Vellaimanal', 'China Bay', 'Orr\'s Hill', 'Thillainagar', 'Arasady', 'Manayaveli', 'Sonagavadi', 'Arunagirinagar', 'Villundy'] 
      },
      { 
        name: 'Thambalagamuwa', 
        gnDivisions: ['Galmetiyawa North', 'Palampataru', 'Puthukkudieruppu', 'Potkerny', 'Meera Nagar', 'Siraj Nagar', 'Kovil Kudiyiruppu', 'Thambalagamuwa', 'Mollipothana North', 'Galmetiyawa South', 'Mollipothana', 'Mollipothana East'] 
      },
      { 
        name: 'Kantalai', 
        gnDivisions: ['Wendrasapura Unit 16', 'Ganthalawa, Unit 12', 'Gantalawa, Unit 11', 'Vaan Ela East', 'Vanela West', 'Pansal Godella', 'Sooriyapura', 'Jayanthipura', 'Raja Ela Unit 04', 'Raja Ela Unit 05', 'Wandrasapura Unit 15', 'Wandrasanpura, Unit 14', 'Bhathiya Gama', 'Raja Ela Unit 03', 'Peraru Unit 02', 'Peraru East', 'Peraru West', 'Kanthale Town South', 'Kanthale Town', 'Agbopura', 'Batukachchiya', 'Rajawewa', 'Seenipura'] 
      },
      { 
        name: 'Kinniya', 
        gnDivisions: ['Munaichana', 'Maniyarasankulam', 'Mancholai', 'Malinthurai', 'Majeeth Nagar', 'Magaru Gramam', 'Maharoof Nagar', 'Ayliyady', 'Annal Nagar', 'Alenkany', 'Ehuthar Nagar', 'Echchan Teevu', 'Kuttikarach', 'Kurinchakany', 'Mancholai Chanai', 'Naduoothu', 'Nadutheevu #', 'Pariya Kainniya', 'Periyathumunai', 'Poovarasantheevu', 'Kinniya', 'Ideman', 'Faizal Nagar', 'Kachchakoditheevu', 'Kattayaru', 'Kakamunai', 'Rahumaniya Nagar', 'Samavechchatheevu', 'SinnaKinniya', 'Surangal', 'Upparu'] 
      },
      { 
        name: 'Muthur', 
        gnDivisions: ['Sampoor West', 'Koonithevu', 'Navareththinapuram', 'Sampoor East', 'Kadatkaraichenai', 'Kaddaiparichchan North', 'Thqwa Nagar', 'Muthur East', 'Nadutheevu', 'Thaha Nagar', 'Muthur Central', 'Muthur West', 'Ralkuli', 'Shafi Nagar', 'Periyapalam', 'Jaya Nagar', 'Alim Nagar', 'Anaichenai', 'Neithal Nagar', 'Palanagar', 'Kaddaiparichchan South', 'Pallikudyjiruppu', 'Chenaiyoor', 'Paddalipuram', 'Nallur', 'Iqbal Nagar', 'Allai Nagar East', 'Allai Nagar West', 'Thoppur', 'Palathoppur', 'Jinna Nagar', 'Iruthayapuram', 'Peyaveli', 'Mallihaitheevu', 'Paddithidal', 'Palaththadichenai', 'Jinna Nagar', 'Azath Nagar', 'Barathipuram', 'Kiliveddy', 'Menkamam', 'Kanguveli'] 
      },
      { 
        name: 'Seruwila', 
        gnDivisions: ['Nilapola', 'Samagipura', 'Sivapuram', 'Dehiwaththa', 'Tanganagar', 'Kawanthissapura', 'Seruwila', 'Nawakkenikadu', 'Sumedhankarapura', 'Mahindapura', 'Serunuwara', 'Mahaweligama', 'Lingapuram', 'Ariyamankani', 'Sirimangalapura', 'Somapura'] 
      },
      { 
        name: 'Verugal', 
        gnDivisions: ['Elangaithurai', 'Elangaithuraimugaththuwara', 'Karukkamunai', 'Poonagar', 'Poomaraththadichenai', 'Eachchilampattu', 'Verugal', 'Anaithivu', 'Verugalmugaththuwaram', 'Uppooral'] 
      },
    ]
  },
  'Kurunegala': {
    province: 'North Western',
    divisionalSecretariats: [
      { 
        name: 'Giribawa', 
        gnDivisions: ['Jayanthipura', 'Bambare', 'Sandagala', 'Abhayapura', 'Sangabopura', 'Gurulupitigama', 'Warawewa', 'Pothana', 'Pahala Giribawa', 'Ihala Giribawa', 'Weragala', 'Ihala Maradankadawala', 'Hettiarachchigama'] 
      },
      { 
        name: 'Galgamuwa', 
        gnDivisions: ['Gemunupura', 'Ethiniwetunugala', 'Thissapura', 'Peddogama', 'Katuwewa', 'Thorawa', 'Nahettikulama', 'Wadugama', 'Konwewa', 'Kattakaduwa', 'Kurundewa', 'Palukadawala'] 
      },
      { 
        name: 'Ehetuwewa', 
        gnDivisions: ['Medinnoruwa', 'Mahawelithenna', 'Ihala Digana', 'Nithalawa', 'Galapitadigana', 'Ethinimale'] 
      },
      { 
        name: 'Kotavehera', 
        gnDivisions: ['Digannewa', 'Kelegama', 'Digannewaththa', 'Mahamithawa', 'Dehennegama', 'Ihala Weeradadana', 'Monnekulama', 'Nawana', 'Nagala', 'Itewa', 'Dodamggollegama'] 
      },
      { 
        name: 'Nikaweratiya', 
        gnDivisions: ['Kivulegama', 'Nabadewa', 'Diyagama', 'Nikaweratiya North', 'Thimbiriyawa', 'Galagedara', 'Randenigama', 'Diwullagoda', 'Siyambalewa', 'Nikaweratiya South', 'Viharagama', 'Danduwawa', 'Pahala Galapitiyagama', 'Tharanagolla'] 
      },
      { 
        name: 'Mahawa', 
        gnDivisions: ['Kohombakadawala', 'Karuwalagahawatta', 'Makaduwawa', 'Tumbullegama', 'Thalambuwa', 'Kumbukwewa', 'Kakunawa', 'Ambagaswewa', 'Gajaneggama', 'Pothuwewa'] 
      },
      { 
        name: 'Polpithigama', 
        gnDivisions: ['Kiribamunegama', 'Madagalla', 'Galagedaragama'] 
      },
      { 
        name: 'Ibbagamuwa', 
        gnDivisions: ['Polkatuwa', 'Diggalawatta', 'Gurussa', 'Thihawa', 'Ganegoda', 'Lenawa', 'Bandipola', 'Kahatawela', 'Nekaththa', 'Godarathmale', 'Ibbagamuwa', 'Dehelgamuwa', 'Mahamukalanyaya', 'Bogamuwa', 'Madihe Thethilianga', 'Galketigama', 'Bakmeegolla', 'Kumbal Anga', 'Nembilikumbura'] 
      },
      { 
        name: 'Ganewatta', 
        gnDivisions: ['Digankonwewa', 'Kalatuwagama', 'Aluthgama', 'Seerangoda', 'Makulmade', 'Neerawiya', 'Waduwawa', 'Santhanagama', 'Nikagolla', 'Thiththawella', 'Jahapagama', 'Neriyawa', 'Arankele', 'Thittawelgala', 'Hunupola', 'Wegolla', 'Makulwewa', 'Thanthirigama', 'Kirindiwelmada/Galagedara', 'Seeradunna'] 
      },
      { 
        name: 'Wariyapola', 
        gnDivisions: ['Minuwangete', 'Nelliya', 'Digithawa', 'Ethawa', 'Welawa', 'Rambukana', 'Awlegama'] 
      },
      { 
        name: 'Kobeigane', 
        gnDivisions: ['Aralugaswewa', 'Walaswewa', 'Pannawa', 'Galatabediwewa'] 
      },
      { 
        name: 'Panduwasnuwara', 
        gnDivisions: ['Konwewa', 'Rambawa', 'Madulla', 'Wadumunna', 'Girathalana', 'Nikapitiya', 'Othegama', 'Diggalagedara', 'Dorabawila', 'Nallura', 'Bamunumulla', 'Meegaspitiya', 'Yayegedara'] 
      },
      { 
        name: 'Paduwasnuwara East', 
        gnDivisions: ['Wilbagedara', 'Hanwella', 'Palavitiya', 'Kolambagama', 'Gallehepitiya', 'Ranorawa', 'Katumuluwa', 'Maveehena', 'Thissawa', 'Nelibewa', 'Dematawa', 'Angamuwa', 'Anukkanhena', 'Moragane', 'Gonnawa', 'Bodhimulla', 'Nindawela', 'Wijaya Udagama', 'Wetehepitiya', 'Hindawa', 'Kanoyaya', 'Kandegedara'] 
      },
      { 
        name: 'Bamunakotuwa', 
        gnDivisions: ['Nathagane', 'Kadiharaya', 'Bamunakotuwa'] 
      },
      { 
        name: 'Maspotha', 
        gnDivisions: ['Gonagama', 'Rakawa', 'Pimburuwellegama', 'Galagedara', 'Minhettiya', 'Hanwella', 'Maragama'] 
      },
      { 
        name: 'Kurunegala', 
        gnDivisions: ['Wehera East', 'Wehera West', 'Akaragana North'] 
      },
      { 
        name: 'Mawathagama', 
        gnDivisions: ['Malandeniya', 'Kahapathwala', 'Hettipola'] 
      },
      { 
        name: 'Rideegama', 
        gnDivisions: ['Andapola', 'Udakendawala', 'Katiyawa', 'Udahena', 'Koswaththa', 'Dodangahakotuwa', 'Wegama', 'Gopallawa', 'Kurukeppetiya', 'Paragoda', 'Ikiriwatta', 'Niyangama'] 
      },
      { 
        name: 'Weerambugedara', 
        gnDivisions: ['Hurukgamuwa', 'Ginipenda', 'Kalugamuwa'] 
      },
      { 
        name: 'Kuliyapitiya East', 
        gnDivisions: ['Bogamulla', 'Andigedara', 'Karagahagedara', 'Nakkawaththa', 'Hewanellagaraya', 'Ihala Muruthange'] 
      },
      { 
        name: 'Kuliyapitiya West', 
        gnDivisions: ['Koshena', 'Pahala Galpola', 'Ihala Galpola', 'Pahala Weerambuwa', 'Ihala Weerambuwa', 'Kurudalpotha', 'Haggamuwa', 'Galahitiyawa', 'Dandagamuwa East', 'Diyadora', 'Inguruwatta', 'Diyadora Ihala Watta'] 
      },
      { 
        name: 'Pannala', 
        gnDivisions: ['Narangoda North', 'Erepola', 'Madigepola', 'Nedalagamuwa South', 'Yayamulla', 'Raddalana', 'Waguruwela', 'Wellawa', 'Narangamuwa', 'Malgamuwa'] 
      },
      { 
        name: 'Narammala', 
        gnDivisions: ['Pahamune', 'Kadahapola', 'Penthenigoda', 'Ganegoda', 'Polgahayaya', 'Ginigathpitiya', 'Dambagirigama East', 'Medagoda', 'Dambagirigama West', 'Narammala', 'Ambagammana', 'Yakkavita', 'Halwella', 'Rammuthugala', 'Muthugala West', 'Dambadeniya South', 'Dambadeniya North', 'Delikanu Anga', 'Kudagammana', 'Riloluwa'] 
      },
      { 
        name: 'Alawwa', 
        gnDivisions: ['Nungamuwa Pahala', 'Wadawa', 'Nungamuwa Ihala', 'Pangolla', 'Kandegedara North', 'Divulgahakotuwa', 'Waduwawa'] 
      },
      { 
        name: 'Polgahawela', 
        gnDivisions: ['Ginneriya', 'Wadakada', 'Habarawa', 'Yatihena', 'Maningamuwa', 'Mawathagama', 'Mandawela', 'Denagamuwa', 'Madalagama', 'Godawela', 'Yogamuwakanda', 'Epakanda', 'Ganegoda North', 'Delgolla', 'Gorokgahapoththa', 'Godigamuwa', 'Kuleepitiya North', 'Ganegoda South', 'Polgahawela North'] 
      },
    ]
  },
  'Puttalam': {
    province: 'North Western',
    divisionalSecretariats: [
      { 
        name: 'Kalpitiya', 
        gnDivisions: ['Datchbay', 'Palliyawatta', 'Anawasala', 'Thigali', 'Eatale', 'Andankeny', 'Alankuda', 'Daluwa', 'Thethapola', 'Karambe'] 
      },
      { 
        name: 'Karuwalagaswewa', 
        gnDivisions: ['Saliyawewa - C', 'Saliyawewa - B', 'Palugassegama', 'Ihala Puliyankulama', 'Thambapanniya', 'Medagama', 'Aluthgama', 'Weerapura', 'Dangaswewa', 'Ipalogama', 'Kumbukwewa', 'Rambawewa', 'Pahariya', 'Murukkuwatawana', 'Thabbowa South', 'Thabbowa North', 'Thewanuwara', 'Pawattamaduwa', 'Karuwalagaswewa', 'Kuda Medawachchiya', 'Neliwewa (Paleegama)', 'Egodapitiya'] 
      },
      { 
        name: 'Nawagattegama', 
        gnDivisions: ['Mahameddewa', 'Moragahawewa', 'Maha Andarawewa', 'Kirimetiyawa', 'Miyellewa', 'Thammennawetiya', 'Samurdhigama', 'Amunuwewa', 'Kuruluwewa', 'Tharanagahawewa', 'Kelewewa', 'Welewewa North', 'Mullegama', 'Welewewa South', 'Gedarawewa', 'Rambakanayagama', 'Inginimitiya East', 'Inginimitiya West', 'Konkadawala'] 
      },
      { 
        name: 'Puttalam', 
        gnDivisions: ['Manalthivu', 'Sirambiadiya', 'Rathmalyaya', 'Thammannagama', 'Kalladiya', 'Attavilluwa Central'] 
      },
      { 
        name: 'Mundalama', 
        gnDivisions: ['Puladiviyal', 'Viruthodai', 'Kattaikadu', 'Sinnapadu', 'Poonapiti', 'Andimunai', 'Karathanvilluwa', 'Tharakudivilluwa', 'Angunavila'] 
      },
      { 
        name: 'Mahakumbukkadawala', 
        gnDivisions: ['Rathmalgaswewa', 'Dangaswewa', 'Kawayankulama', 'Maha Kumbukkadawala', 'Sembukuliya', 'Walpaluwa', 'Kakupandiyawa', 'Punavitiya', 'Garayakgama', 'Daluwegama', 'Mohoriya', 'Baranankattuwa', 'Karungalichole', 'Mahasembukuliya', 'Galkuliya West', 'Galkuliya East', 'Adigama'] 
      },
      { 
        name: 'Anamaduwa', 
        gnDivisions: ['Kottukachchiya Colony 2', 'Kottukachchiya Colony 1', 'Mellankulama', 'Kottukachchiya', 'Paliyagama', 'Uriyawa', 'Koiladigama', '07 Gammanaya', 'Maha Uswewa South', 'Maha Uswewa North', 'Alankulam', 'Merungoda', 'Labugala', 'Karambewa', 'Thalgaswewa', 'Periyakulama', 'Paramakandagama', 'Thonigala', 'Wadatta', 'Viharagama', 'Siyabalagashena', 'Thattewa', 'Thanmmennagama', 'Bammannegama', 'Kothalakemiyawa', 'Gallewa', 'Thalakolawewa', 'Anamaduwa', 'Peramakuttuwa', 'Divulwewa', 'Wadigamangawa', 'Dharmapalaya', 'Uppalawatta', 'Sangattikulama', 'Mudalakkuliya'] 
      },
      { 
        name: 'Pallama', 
        gnDivisions: ['Dewala Handiya', 'Wilpatha East', 'Siyambalagaswewa', 'Nagavila', 'Periyamaduwa', 'Kammandaluwa', 'Katupotha', 'Madawakkulam', 'Watiya', 'Nandimithtrapuram', 'Wendakadu', 'Pallama', 'Wathupola'] 
      },
      { 
        name: 'Arachchikattuwa', 
        gnDivisions: ['Mahamaeliya', 'Buruthakele', 'Wijayakatupatha', 'Pahala Attanganaya', 'Wijayakatupatha Elen Egoda', 'Anavilundawa', 'Wairankattuwa', 'Sengaloya', 'Arachchikattuwa West', 'Arachchikattuwa East', 'Bandarahena', 'Adippala', 'Andanan Kattuwa', 'Kumarakattuwa', 'Elivitiya', 'Diganwewa', 'Rajakadaluwa', 'Kusala', 'Kottapitiya', 'Bangadeniya', 'Weerakumandaluwa'] 
      },
      { 
        name: 'Chilaw', 
        gnDivisions: ['Kurusapaduwa', 'Deduruoya', 'Manuwangama West', 'Weerapandiyana', 'Maha Vilattawa', 'Kanattawa', 'Nariyagama South', 'Wattakkalliya', 'Weralabada South', 'Weralabada North', 'Egodawatta', 'Aluthwatta', 'Ichchampitiya', 'Karavitagara East', 'Dambakele', 'Weerakelewatta', 'Karavita', 'Mungandaluwa East', 'Mungandaluwa West', 'Weralabada', 'Welihena', 'Merawala', 'Olidaluwa', 'Ambakandavila', 'Kakapalliya'] 
      },
      { 
        name: 'Madampe', 
        gnDivisions: ['Athuwana', 'Mahagama North', 'Mahagama South', 'Kongasyaya', 'Ponnankanniya', 'Manakkulama', 'Dematapitiya', 'Medagama', 'Panirendawa', 'Rathmal Agara', 'Rathnagiriya', 'Nankadawara', 'Kuda Bingiriya', 'Indigasvila', 'Walahena', 'Pambala', 'Pambala South', 'Hareendragama', 'Sembukattiya', 'Uraliya', 'Heen Agara', 'Kachchakadduwa', 'Galmuruwa North', 'Kudirippuwa', 'Galahitiyawa', 'Marakkalagama', 'Irattakulama North', 'Irattakulama South', 'Egodayagama', 'Pattiyagama', 'Ihalagama', 'Uraliyagara', 'Mellawagara', 'Suduwella', 'Pothuvila', 'Pallakele', 'Galmuruwa South', 'Mahabaddegama', 'Thaniwellegama'] 
      },
      { 
        name: 'Mahawewa', 
        gnDivisions: ['Iranavila West', 'Iranavila East', 'Thoduwawa North', 'Meda Thoduwawa', 'Thoduwawa South', 'Mattakotuwa', 'Pahala Mahawewa', 'Adapparagama', 'Ihala Kudawewa', 'Puruduwella', 'Galamuna', 'Medagoda', 'Hewana', 'Yatakalana', 'Muttibendivila', 'Ihala Walahapitiya', 'Meda Walahapitiya', 'Pahala Kudawewa', 'Maligawatta', 'Meda Mahawewa', 'Veehena', 'Pahala Koswadiya', 'Meda Koswadiya', 'Ihala Koswadiya', 'Pahala Walahapitiya', 'Panangoda', 'Sagaragama', 'Egodagoda', 'Maravila North', 'Ihala Hattiniya', 'Maranda North', 'Maranda South', 'Horagolla North', 'Horagolla South'] 
      },
      { 
        name: 'Nattandiya', 
        gnDivisions: ['Meda Thabbowa', 'Pahala Thabbowa', 'Weerahena East', 'Ihala Nattandiya', 'Meda Nattandiya', 'Weerahena West', 'Mudukatuwa North', 'Mudukatuwa South', 'Mudukatuwa East', 'Pahala Mavila', 'Meda Mavila', 'Ihala Mavila', 'Pahala Kottaramulla', 'Paluwelgala North', 'Kachchirawa', 'Paluwelgala South', 'Naravila', 'Kuddetiyawa', 'Yakadessawa', 'Koswatta North', 'Meegahawela', 'Koswatta South', 'Morakele South', 'Meda Kottaramulla', 'Morakele North', 'Ihala Kottaramulla', 'Thunmodara East', 'Thunmodara West', 'Nakele', 'Ihala Katuneriya', 'Bulugahawewa', 'Nebadagahayaya', 'Lansigama', 'Pahala Kauneriya North', 'Meda Pahala Katuneriya', 'Pahala Katuneriya South', 'Meda Katuneriya', 'Meegahawewa', 'Dematapitiya', 'Dhammikagama'] 
      },
      { 
        name: 'Wennappuwa', 
        gnDivisions: ['Kolinjadiya West', 'Kolinjadiya North', 'Udasirigama', 'Sirigampala North', 'Lunuvila East', 'Lunuwila West', 'Wennappuwa North', 'Kolinjadiya East', 'Kolinjadiya South', 'Ulhitiyawa West', 'Ulhitiyawa North', 'Meda Ulhitiyawa', 'Wennappuwa West', 'Meda Wennappuwa', 'Wennappuwa East', 'Lunuwila South', 'Bandirippuwa North', 'Dummaladeniya South', 'Wellamankaraya', 'Meda Nainamadama', 'Hanathotupala', 'Boralessa West', 'Nainamadama West', 'Nainamadama East', 'Mirissankotuwa North', 'Kammala', 'Angampitiya East', 'Angampitiya West', 'Aluththota', 'Sindathriya', 'Waikkala North'] 
      },
      { 
        name: 'Dankotuwa', 
        gnDivisions: ['Bothalegama', 'Kirimetiyana East', 'Thulawala', 'Hundirapola', 'Pothuwatawana', 'Lihiriyagama', 'Kahatavila East', 'Kahatavila West', 'Meda Kirimetiyana', 'Kirimetiyana North', 'Kirimetiyana West', 'Kirimetiyana South', 'Pansal Junction', 'Haldanduwana North', 'Mellawa', 'Ihala Bujjampola', 'Pahala Bujjampala', 'Haldanduwana West', 'Meda Haldanduwana', 'Katukenda East', 'Meda Katukenda', 'Gonavila North', 'Meda Gonavila', 'Katukenda West', 'Dankotuwa West', 'Dankotuwa North', 'Ihala Dummalakotuwa', 'Haldanduwana South', 'Pahala Mohottimulla', 'Ihala Mohottimulla', 'Sendiriyamulla', 'Singakkuliya', 'Kaluwachchimulla', 'Motemulla', 'Etiyawala North', 'Pahala Dummalakotuwa', 'Dankotuwa East', 'Dankotuwa South', 'Gonavila South', 'Godella', 'Morukkuliya', 'Metikotuwa', 'Thamarakuliya', 'Etiyawala South', 'Jankurawela', 'Yogiyana', 'Dikwela'] 
      },
    ]
  },
  'Anuradhapura': {
    province: 'North Central',
    divisionalSecretariats: [
      { 
        name: 'Padaviya', 
        gnDivisions: ['Buddhangala', 'Elikibulagala', 'Abayapura', 'Ruwanpura', 'Bogahawewa', 'Padaviya'] 
      },
      { 
        name: 'Kebithigollewa', 
        gnDivisions: ['Bellankadawala', 'Punchimudagama', 'Wahalkada D 6', 'Gonumeriyawa', 'Kabithigollewa', 'Ihala Usgollewa', 'Aiyathigewewa', 'Bandaraulpatha', 'Kiriketuwawe', 'Gonuhaddenawa', 'Thibiriwewa', 'Kirimatiyawa', 'Watthewewa'] 
      },
      { 
        name: 'Medawachchiya', 
        gnDivisions: ['Prabodagama', 'Kirigalwewa', 'Agunochchiya', 'Akirikanda', 'Rail Way Town', 'Kadawathgama', 'Kudakubukgollewa'] 
      },
      { 
        name: 'Mahavilachchiya', 
        gnDivisions: ['Thantirimale', 'Nelumwila', 'Sadamaleliya', 'Mahavilachchiya', 'Pemaduwa', 'Halabawewa', 'Dunumadalawa'] 
      },
      { 
        name: 'Nuwaragam Palatha Central', 
        gnDivisions: ['Helambagaswewa', 'Asirikgama', 'Gambirigaswewa', 'Aluthgama', 'Galpottegama', 'Maha Ehetuwewa', 'Maningamuwa', 'Elayapatthuwa', 'Diganegama', 'Karambewa', 'Galkadawela', 'Puwarasankulama', 'Paniyankadawala', 'Parasangaswewa', 'Mankadawala', 'Saliyapura', 'Ashokaramaya', 'Perimiyankulama', 'Katukeliyawa', 'Pusiyankulama', 'Maha Mankadawala', 'Ilandagahawewa', 'Vihara Kallanchiya', 'Abayawewa', 'Pethispura', 'Bandara Puliyankulama', 'Jayanthi Gramaya', 'Theppankulama', 'Thannayamkulama', 'Saliya Mawatha', 'Scared City', 'Tisawewa', 'Wessagiriya', 'Pahalagama', 'Maha Bulankulama', 'Ulukkulama'] 
      },
      { 
        name: 'Rambewa', 
        gnDivisions: ['Kolibendawewa', 'Medagama', 'Kadurugasdamana', 'Kedewa', 'Kallanchiya', 'Gonewa', 'Peenagama', 'Meemalwewa', 'Rotawewa'] 
      },
      { 
        name: 'Kahatagasdigiliya', 
        gnDivisions: ['Dachchihalmillewa', 'Maha Halmillewa', 'Kummukgollewa', 'Mahawewa', 'Kahatagasdigiliya East', 'Kahatagasdigiliya West', 'Kokmaduwa', 'Moragahawela', 'Ranpathwila', 'Bethkewa Thulana', 'Maha Messallawa', 'Kohobagaskada', 'Koonwewa', 'Abagahawewa', 'Diwulwewa', 'Diganhalmillewa', 'Kelanikawewa'] 
      },
      { 
        name: 'Horowpothana', 
        gnDivisions: ['Wagollakada', 'Dutuwewa', 'Morawewa', 'Dekethipothana', 'Dematawewa', 'Diyathithawewa'] 
      },
      { 
        name: 'Galenbindunuwewa', 
        gnDivisions: ['Dutuwewa', 'Perattupalagama', 'Kokawewa', '21 Colany West', 'Ulpathgama', 'Upuldeniya', 'Himbutugollewa', 'Mailagaswewa', 'Ihalagama', 'Galenbindunuwewa', 'Karuwalagaswewa', 'Palugollagama', 'Aluth Divulwewa', 'Gatalawa', 'Hurulunikawewa', 'Ilukbadayagama', 'Kuda Galenbindunuwewa', 'Thammennagama', 'Siwalakulama', 'Gomarankalla', 'Hurulunikawewa Yaya 03', 'Kumbukwewa', 'Janasirigama', 'Sunanda Mawatha', 'Galwaduwagama', 'Muriyakadawala', 'Ihala Galkulama', 'Hurulumeegahapattiya', 'Nuwaraeliya Colany', 'Pandikaramaduwa', 'Yakalla', 'Manankattiya', 'Wannankulama'] 
      },
      { 
        name: 'Mihinthale', 
        gnDivisions: ['Ukkulankulama', 'Mahakanadarawa - yaya 03', 'Mahakandarawa - Yaya 02', 'Thammennawa', 'Kasamaduwa', 'Stage (II) part (III)', 'Stage (II) part (II)', 'Pothanegama', 'Stage (III) part (III)', 'Stage (II) part (I)', 'Stage (II) part (IV)', 'Vanniyankulama (IV)', 'Vanniyankulama (V)', 'Vanniyankulama (VI)', 'Ghanikulama', 'Kawarakkulama', 'MahaPaladikulama', 'Stage(III) part (I)', 'Stage(III) part (II)', 'Vanniyankulama (III)', 'Vanniyankulama (I)', 'Vanniyankulama (II)', 'Sucharithagama'] 
      },
      { 
        name: 'Nachchadoowa', 
        gnDivisions: ['Kibulakada', 'Aluthwewa', 'Amane', 'Maha Nelubewa', 'Uthuru Kaluwila', 'Madawalagama', 'Nachchaduwa', 'Nachchaduwa New Town', 'Palayakulama', 'Suhadagama'] 
      },
      { 
        name: 'Nochchiyagama', 
        gnDivisions: ['Mahalindawewa', 'Bogahawewa', 'Ambagahawewa', 'Ehetuwagama', 'Thalgaswewa', 'Hunuvilagama', 'Horuvila', 'Lindawewa', 'Adampane', 'Andarawewa', 'Ralapanawa Jnapadaya', 'Nochchiyagama', 'Dunudambuwewa', 'Thimbiriwewa', 'Katupathwewa', 'Pahala Maragahawewa', 'Nelawagama', 'Pahala Halmillewa', 'Halmillakulama', 'Dunupothagama', 'Galadiulwewa', 'Jayagama', 'Amunukole', 'Ottappuwa'] 
      },
      { 
        name: 'Rajanganaya', 
        gnDivisions: ['Track 13 - 18', 'Track 16 - 17', 'Veheragala', 'Track 12', 'Gemunupura', 'Track 07', 'Thumbullegama', 'Randenigama', 'Track 4', 'Track 3', 'Naigala', 'Thissapura', 'Maha Thibrikalla'] 
      },
      { 
        name: 'Thambuttegama', 
        gnDivisions: ['Delnegama', 'Kuda Bellankada', 'Koonwewa', 'Thelhiriyawa', 'Ikiriwewa', 'Musalpitiya', 'Thispanepura', 'Makulewa', 'Thammennawa'] 
      },
      { 
        name: 'Thalawa', 
        gnDivisions: ['Nawa Hanguranketha', 'Hirigollegama', 'Karagahawewa', 'Eliyadivulwewa', 'Ihala Siyambalewa', 'Adhiranigama', 'Katiyawa Track 10', 'Katiyawa Track 09', 'Katiyawa Track 01', 'Edagala', 'Kelesiyambalewa'] 
      },
      { 
        name: 'Thirappane', 
        gnDivisions: ['Gnanikkulama', 'Perimiyankulama', 'Wannankulama', 'Sembukulama', 'Wellamudawa', 'Selesthimaduwa', 'Kattamurichchana', 'Kandupagama', 'Labunoruwa'] 
      },
      { 
        name: 'Kekirawa', 
        gnDivisions: ['Mahadiwulwewa', 'Keeriyagaswewa', 'Ihala Puliyankulama', 'Kele-Puliyankulama', 'Maradankadawela', 'Ganewalpola', 'Heenukkiriyawa', 'Ebulgaswewa', 'Maha Elagamuwa', 'Pallehigura', 'Nelbagama'] 
      },
      { 
        name: 'Palugaswewa', 
        gnDivisions: ['Eppawala', 'Galapitagala', 'Kumbukwewa', 'Kashyapagama'] 
      },
      { 
        name: 'Ipalogama', 
        gnDivisions: ['Dikwewa-Senapura', 'Galagedara Gama', 'Senapura Gama', 'Mahailuppallama', 'Gonapathirawa', 'Sangattewa', 'Kadiyangalla', 'Ipalogama', 'Manewa', 'Heenukwe Gama', 'Hiripitiyagama', 'Aswedduma', 'Ganthiriya Gama', 'Galwanguwa', 'Wedinigama', 'Narangallegama'] 
      },
      { 
        name: 'Galnewa', 
        gnDivisions: ['Obadayagama', 'Otunupalandigama', 'Karuwalagaswewa', 'Usgala Halmillawewa', 'Helabodugama', 'Kaththaragama', 'Bulnewa', 'Thoranegama', 'Midellewa', 'Ihala Kalankuttiya', 'Pahala Kalankuttiya', 'Siyambalewa', 'Lolugaswewa', 'PitiyeYaya', 'Galnewagama', 'Galnewa Town', 'Malbaligala', 'Handungama', 'Musnawa', 'Kala-Medawachchiya', 'Kumbukwewa', 'Kallanchiya', 'Negama', 'Werunkulama', 'Walaswewa', 'Kandegama', 'Kandulegama', 'Kandulugamuwa', 'Dakunu Siyambalagamuwa'] 
      },
      { 
        name: 'Palagala', 
        gnDivisions: ['Nelliyagama', 'Aluth Kadadugama', 'Ranawa', 'Higuruwelpitiya'] 
      },
    ]
  },
  'Polonnaruwa': {
    province: 'North Central',
    divisionalSecretariats: [
      { name: 'Hingurakgoda', gnDivisions: [
        'Sinhagama', 'Galoya', 'Rotawewa', 'Rathmale', 'Paluwaddana', 'Yodha Ela', 'Yatiyalpathana', 'Rankothgama', 'Siriketha', 'Kumaragama', 'Samapura', 'Kimbulawala', 'Ulpathwewa', 'Minihirigama', 'Moragaswewa', 'Mahasengama', 'Bathgampaththuwa', 'Samagipura', 'Minneriya', 'Pasiyawewa', 'Akkara 70', 'R.B. 01', 'Pulathisigama', 'Ulkatupotha', 'Bopura', 'Jayapura', 'Hinguraka Bandaragama', 'Hinguraka', 'Hathamuna', 'Hingurakgoda', 'Bubula', 'Raja Ela', 'Raja Ela Gama', 'Muwanpelessa', 'C.P. Pura', 'Girithale', 'Girithale Purangama', 'Girithale Colony', 'Henkola Wela', 'Jayanthipura', 'Unagalavehera West', 'Unagalavehera East', 'Chandana Pokuna', 'Nagapokuna', 'Track 12 Pedesa', 'Chethiyagirigama', 'Weeragama', 'Track 05 Pedesa', 'Wijayaraja Wewa', 'Agbopura', 'Katukaliyawa', 'Sudukanda -Nikawewa', 'Thambalawewa'
      ] },
      { name: 'Medirigiriya', gnDivisions: [
        'Wedikachchiya', 'Jayathugama', 'Ekemuthugama', 'Meegaswawe', 'Palliyagodella', 'Wadigawewa', 'Senarathpura', 'Etambaoya', 'Kavuduluwewa', 'Menik Horowwa', 'Biso Bandara', 'Thissapura', 'Abhayapuragama', 'New Town', 'Diggalpura', 'Wedehapura', 'Bisobandara Gama', 'Ambagaswewa', 'Jayagampura', 'Nagarapura', 'Kumudupura', 'Damsopura', 'Aluthwewa', 'Thalakolawewa', 'Ihalagama', 'Wijayapura', 'Bisouyana', 'Diyasenpura', 'Gajabapura', 'Kavudulugama', 'Mandalagiriya', 'Medirigiriya', 'Viharagama', 'Divulankadawala', 'Nelumpokuna', 'Thissa Amuna', 'Kusumpokuna', 'Wijayarajapura', 'Perakumpura', 'Kahambiliyawa', 'Akbarpura', 'Sansungama', 'Veheragala', 'Mahasenpura', 'Yudhaganawa'
      ] },
      { name: 'Lankapura', gnDivisions: [
        'Weli Ela', 'Maha Kirimetiya', 'Buddhayaya', 'Sungavila', 'Jayabima', 'Jayapura', 'Nelumpura', 'Patunugama', 'Munisirigama', 'Pansalgodella', 'Gal Amuna', 'Hingurakdamana', 'Gemunupura', 'Senanayakapura', 'Debarella', 'Somapura', 'Abhayapura', 'Sanghabodhi Gama', 'Pulasthigama', 'Kegalugama', 'Thalpotha', 'Bauddhartha Gama', 'Lankapura', 'Rifaipura', 'Al Hilalpura', 'Thambala', 'Onegama Muslimgama', 'Weerapura'
      ] },
      { name: 'Welikanda', gnDivisions: [
        'Sinhapura', 'Kandakaduwa', 'Katuwanvila West', 'Katuwanvila East', 'Kudapokuna', 'Muthuwella', 'Mahindagama', 'Mangulpokuna', 'Ruhunuketha', 'Malvila', 'Senapura', 'Muthugala', 'Alinchipothana', 'Madurangala', 'Mallinda', 'Sandunpitiya', 'Susirigama', 'Monarathenna', 'Welikanda', 'Kadawathamaduwa', 'Bo-Atta', 'Menikwela', 'Sewanapitiya', 'Mahawewa', 'Karapola', 'Ginidamana', 'Borawewa', 'Nelumwewa', 'Rideepokuna', 'Aluthwewa'
      ] },
      { name: 'Dimbulagala', gnDivisions: [
        'Manampitiya', 'Manampitiya East', 'Dalukana', 'Kudawewa', 'Medagama', 'Jayapura', 'Wijayabapura', 'Veheragama', 'Millana', 'Dimbulagala', 'Yakkure', 'Damanewewa', 'Pihitiwewa', 'Pahala Yakkure', 'Maguldamana', 'Pelatiyawa', 'Mahaulpatha', 'Bogaswewa', 'Rathmalthenna', 'Track 05 Aralaganvila', 'Gomathiyaya', 'Arunapura', 'Aralaganwila', 'Aralaganwila West', 'Weerana', 'Bimpokuna', 'Pahala Ellewewa', 'Kalukele', 'Nawagaha Ela', 'Nuwaragala', 'Bandanagala', 'Ellewewa', 'Ihala Ellewewa', 'Mahadamana', 'Pimburattewa West', 'Divuldamana', 'Nidanwala', 'Ihalawewa', 'Pimburattewa East', 'Aluthoya', 'Veheragala', 'Warapitiya', 'Gal Eliya', 'Weeralanda', 'Sandagalathenna', 'Ulpathwewa', 'Alawakumbura', 'Kandegama', 'Kanichchagala', 'Kekuluwela', 'Maldeniya', 'Miewathpura', 'Rankethgama', 'Mudungama', 'Siripura', 'Salasumgama'
      ] },
      { name: 'Thamankaduwa', gnDivisions: [
        'Shanthi Pura', 'Sinha Pura', 'Wijayabahu Pura', 'Unagalavehera South', 'Laksha Uyana', 'Sevagama', 'Wewethenna', 'Monarathenna', 'Damana Gemunupura', 'Kalinga Ela', 'Onegama', 'Sinharajapura', 'Pudur', 'Medamaluwa', 'Wijayaraja Pura', 'Palugasdamana 03 Ela', 'Palugasdamana 02 Ela', 'Palugasdamana 01 Ela', 'Palugasdamana South', 'Palugasdamana North', 'Nishshankamallapura', 'Ethumalpitiya', 'Nikawewa', 'Kadawala Wewa', 'Samudragama', 'Sirisangabo Pedesa', 'Bendiwewa', 'Galthambarawa', 'Kuruppu Junction', 'Mahasen Pedesa', 'Kaduruwela West', 'Kaduruwela East', 'Divulana', 'Gallella', 'Manikkampattiya', 'Gallella West', 'Nelumvila', 'Kaduruwela South', 'Perakum Pedesa', 'Weera Pedesa', 'Pulathisi Pedesa', 'Polonnaruwa Town', 'Thopawewa', 'Sinha Udagama', 'Pothgul Pedesa', 'Udawela', 'Ganangolla', 'Nishshankamalla Pedesa', 'Mahaweli Pedesa', 'Kotaliya', 'Aluth Wewa East', 'Aluth Wewa West', 'Parakrama Samudraya', 'Ambanganga', 'Kalahagala'
      ] },
      { name: 'Elahera', gnDivisions: [
        'Ihakuluwewa', 'Katukeliyawa', 'Diyabeduma', 'Konduruwawa', 'Attanakadawala West', 'Radavigeoya', 'Madudamana', 'Attanakadawala North', 'Attanakadawala South', 'Ikiriwewa', 'Kahatagahapitiya', 'Nikapitiya', 'Sarubima', 'Segala', 'Kottapitiya South', 'Somiyals', 'Gageyaya', 'Kottapitiya North', 'Damanayaya', 'Elahara', 'Heeratiya', 'Bakamoona', 'Sirikanduyaya', 'Atharagallewa', 'Maluweyaya', 'Orubendi Siyambalawa', 'Kumara Ella', 'Kirioya'
      ] },
    ]
  },
  'Badulla': {
    province: 'Uva',
    divisionalSecretariats: [
      { name: 'Mahiyanganaya', gnDivisions: ['Rotalawela', 'Divulapelessa', 'Aluyatawala', 'Theldeniyaya', 'Hebarawa', 'Ginnoruwa', 'Belaganwewa', 'Ulhitiya', 'Pahala Rathkinda', 'Hobariyawa', 'Millattawa', 'Wiranegama', 'Aluttarama', 'Girandurukotte', 'Bathalayaya', 'Haddattawa', 'Meegahahena', 'Galporuyaya', 'Beligalla', 'Dambana', 'Kukulapola', 'Wewatta', 'Thalangamuwa', 'Sorabora', 'Wewgampaha', 'Dehigolla', 'Elewela', 'Mahiyangana Town', 'Poojanagaraya', 'Dambarawa', 'Senanigama', 'Mapakadawewa', 'Pangaragammana', 'Dambagolla', 'Medayaya'] },
      { name: 'Rideemaliyadda', gnDivisions: ['Orubendiwewa', 'Sangabopura', 'Welampele', 'Keselpotha North', 'Ikiriyagoda', 'Kandubedda', 'Aralupitiya', 'Ekiriyankumbura', 'Dehigama', 'Morana', 'Kudalunuka', 'Aluketiyawa', 'Keselpotha South', 'Serana', 'Arawatta', 'Uva Gemunupura', 'Senewigama', 'Uva Thissapura', 'Gamakumbura North', 'Kooralewela', 'Nagadeepa', 'Mahalunuka', 'Pethiyagoda', 'Rideemaliyadda South', 'Andaulapatha', 'Gamakumbura South', 'Abhayapura', 'Dikkendayaya', 'Pahalaoyagama', 'Bubula', 'Ritigahaarawa', 'Kandegama', 'Mahagama', 'Kuruvithenna', 'Deekirigolla', 'Pinnagolla', 'Arawa', 'Dikyaya', 'Diyakombala'] },
      { name: 'Meegahakivula', gnDivisions: ['Polgahaarawa', 'Polwatta', 'Watagommana', 'Roberiya', 'Pitamaruwa', 'Wewathenna', 'Ellanda', 'Kalugahakandura', 'Komarika', 'Akurukaduwa', 'Meegahakivula', 'Thaldena', 'Kohana', 'Ketawatta', 'Morahela'] },
      { name: 'Kandaketiya', gnDivisions: ['Hevandana', 'Mahathenna', 'Baduluoya East', 'Kandaketiya', 'Welaoya', 'Kivulegedara', 'Kirivehera', 'Wewathenna', 'Maliyadda', 'Pallewela', 'Mudagamuwa', 'Dikkumbura', 'Hapathgamuwa', 'Bopitiya', 'Bogahakumbura', 'Beramada', 'Godunna', 'Wasanagama', 'Thetilla', 'Thalakumbura', 'Galauda', 'Bokanoruwa'] },
      { name: 'Soranathota', gnDivisions: ['Dikpitiya', 'Ledger Watta', 'Idamegama', 'Soranathota', 'Yatilellagama', 'Ambagasdowa', 'Ketakellagama', 'Kuttiyagolla', 'Angoda', 'Kosgolla', 'Rideepana'] },
      { name: 'Passara', gnDivisions: ['Palagolla', 'Gonagala West', 'Gonagala East', 'Kanahela', 'Kanawerella East', 'Bibilegama West', 'Wewekele', 'Bibilegama East', 'Maussagolla East', 'Dambewela'] },
      { name: 'Lunugala', gnDivisions: ['Ekiriya', 'Gallulla', 'Madulsima', 'Sumudugama', 'Attanagolla', 'Sooriyagoda', 'Weragoda', 'Pallekiruwa'] },
      { name: 'Badulla', gnDivisions: ['Andeniya', 'Sirimalgoda', 'Damanwara', 'Hinnarangolla', 'Kendagolla', 'Malangamuwa', 'Viyadiguna', 'Vineethagama', 'Wewessa', 'Welibissa', 'Glen Alpin', 'Udawela', 'Hingurugamuwa', 'Kanupelella'] },
      { name: 'Hali-Ela', gnDivisions: ['Bogoda', 'Panakanniya', 'Ketawala', 'Udakohovila', 'Hethekma', 'Deegalla', 'Pattipola', 'Anthuduwawela', 'Bogahamaditta', 'Mahawattagama', 'Dematawelhinna', 'Welikemulla', 'Unagolla', 'Medapitigama', 'Dikwella', 'Haliela', 'Samagipura', 'Udagama', 'Gawela', 'Pahamunuthota', 'Neludanda', 'Hinnaranagolla', 'Mugunumatha West', 'Mugunumatha East', 'Godegama', 'Medagama', 'Imbulgoda', 'Springvalley', 'Beddegama', 'Wewelhinna', 'Uduwara', 'Hapuwalakumbura', 'Kirinda', 'Morethota', 'Uva Mahawela', 'Etampitiya', 'Pallegama', 'Dehiwinna', 'Niliathugoda', 'Neluwa', 'Kudumahuwela', 'Wepassawela', 'Maligathenna', 'Perahettiya', 'Katugaha', 'Mahathenna', 'Malitta', 'Kurukude', 'Warakadanda'] },
      { name: 'Uva Paranagama', gnDivisions: ['Yalagamuwa', 'Ritikumbura', 'Wethalawa', 'Maspanna', 'Kohilegama', 'Ellanda', 'Kindigoda', 'Hathkinda', 'Dimbulana', 'Ilukwela', 'Gampaha', 'Wewegama', 'Kerklis', 'Malwatte Gama', 'Medipokuna', 'Thuppitiya', 'Panagoda', 'Pitiyakumbura', 'Bambarapana', 'Alagolla', 'Vondmar', 'Thawalampola', 'Kodakumbura', 'Korandekumbura', 'Malapolagama', 'Welamedagama', 'Uduhawara', 'Hangunnawa', 'Ranhawadi Gama', 'Idamegama', 'Paranagama', 'Mudanawa', 'Pannalawela', 'Rahupola', 'Udaperuwa', 'Pallewela', 'Busdulla', 'Kurundugolla', 'Ambagasdowa', 'Pannalagama', 'Uma Ela', 'Karagahaulpatha', 'Medawela', 'Perawella', 'Galahagama', 'Medagoda Gama', 'Thelhawadigama', 'Ketagoda', 'Dangamuwa', 'Rathamba', 'Kumarapattiya', 'Balagala', 'Downside', 'Kendagolla', 'Yahala Arawa', 'Ulugala', 'Hangiliella', 'Kotawara Udagama', 'Kotawera Pahalagama', 'Daragala'] },
      { name: 'Welimada', gnDivisions: ['Alakolagala', 'Hulankapolla', 'Silmiyapura', 'Boragas', 'Vidurupola', 'Gavarammana', 'Palugama Town', 'Puranwela', 'Girambe', 'Divurumgama', 'Palugama Ella', 'Welimadawatta', 'Ambagahakumbura', 'Dimuthugama', 'Welimada Town', 'Landegama', 'Divithotawela', 'Puhulpola', 'Dikkapitiya', 'Koskanuwegama', 'Hewanakumbura', 'Ambewela', 'Himbiliyagolla', 'Thennakonwela', 'Kalubululanda', 'Mawithikumbura', 'Nedungamuwa', 'Medagedaragama', 'Nawela', 'Pahala Yalkumbura', 'Merahawatta', 'Udupeella', 'Kotakithula', 'Malpotha', 'Karagasthenna', 'Alugolla', 'Bogahakumbura', 'Bibiligamuwa', 'Alawathugoda', 'Kandepuhulpola', 'Helayalkumbura', 'Guruthalawa', 'Mahathenna', 'Hingurugamuwa', 'Galedanda', 'Boralanda', 'Wangiyakumbura', 'Ohiya', 'Rahangala', 'Hinnarangolla', 'Udakandagolla', 'Rathkarawwa', 'Pitapola', 'Ohiya Watta', 'Maligathenna', 'Welikadagama'] },
      { name: 'Bandarawela', gnDivisions: ['Mathetilla', 'Konthahela', 'Icelab Watta', 'Ambegoda', 'Wewathenna', 'Watagamuwa', 'Bindunuwewa', 'Bandarawela East', 'Thanthiriya', 'Udaperuwa', 'Egodagama', 'Weheragalathenna', 'Bambaragama', 'Makulella', 'Kinigama', 'Inikambedda', 'Karagahawela', 'Obadella', 'Beddekumbura', 'Kebillawela South', 'Mahaulpatha', 'Darahitawanagoda'] },
      { name: 'Ella', gnDivisions: ['Gawarawela', 'Beddewela', 'Pupula West', 'Pupula', 'Galtanhena', 'Nawela East', 'Nawela West', 'Medawela West', 'Yahalewela', 'Newberg', 'Ella', 'Madhuragama', 'Idamegama', 'Hettipola'] },
      { name: 'Haputale', gnDivisions: ['Bingethenna', 'Kahagolla', 'Dodamwatta', 'Diyathalawa', 'Jayaminipura', 'Aluthwela', 'Welanhinna', 'Pahala Kadurugamuwa', 'Viharakele', 'Umankandura', 'Panketiya', 'Hela Kadurugamuwa', 'Haputhalegama', 'Glananar Watta', 'Horadorowwa', 'Dambethenna', 'Thotalagala', 'Galkanda'] },
      { name: 'Haldummulla', gnDivisions: ['Viharagala', 'Nikapotha West', 'Nikapotha East', 'Lemasthota', 'Ranasinghegama', 'Kotabakma', 'Koslanda', 'Mahakanda', 'Poonagalla', 'Divulgasmulla', 'Gampaha', 'Ampitiyathenna', 'Kelipanawela', 'Moraketiya', 'Kirawanagama', 'Manthenna', 'Amilagama', 'Soragune', 'Kithulgahaarawa', 'Watagamuwa', 'Walhaputhenna', 'Uvathenna', 'Marangahawela', 'Seelathenna', 'Harankahawa', 'Medawela', 'Welibissa', 'Weeliya', 'Kosgama', 'Ranwanguhawa', 'Akkaraseeya', 'Welanwita', 'Kolongasthenna', 'Bambarapokuna', 'Mahalanda'] },
    ]
  },
  'Moneragala': {
    province: 'Uva',
    divisionalSecretariats: [
      { name: 'Bibile', gnDivisions: ['Urawula', 'Karandugala', 'Bulupitiya', 'Nilgala', 'Kanawegalla', 'Ussagala', 'Bokagonna', 'Pitakumbura', 'Hamapola', 'Thotillaketiya', 'Kokunnawa', 'Morattamulla', 'Nagala', 'Radaliyadda', 'Ambagolla', 'Wegama', 'Wegama South', 'Mallahawa', 'Karagahawela East', 'Kehelattawela', 'Karagahawela West', 'Udamallahawa', 'Egoda kotagama', 'Kotagama', 'Badulla gammana', 'Kawdella', 'Rathupaskatiya', 'Lindakumbura', 'Bibila', 'Ambelanda', 'Dodamgolla', 'Dehiattawela', 'Kanulwela', 'Ethanawatta', 'Kuruwamba', 'Hewelwela', 'Moodiyala', 'Yalkumbura', 'Thanayamgama', 'Medipitiya'] },
      { name: 'Madulla', gnDivisions: ['Nelliyadda', 'Mullegama', 'Galgamuwa', 'Iginiyagala', 'Baduluwela', 'Bandarawadiya', 'Panguwa', 'Thalkotayaya', 'Deliwa', 'Thampalawela', 'Ruwalwela', 'Watawanagama', 'Gangodagama', 'Ritigahawatta', 'Mariarawa', 'Kolladeniya', 'Ihawa', 'Alpitiya', 'Makulla', 'Namaloya Colony', 'Aratugaswela', 'Pagura', 'Galbokka', 'Magandana', 'Udumulla', 'Kottagala', 'Gangoda Arawa', 'Polgahagama', 'Alugalge', 'Neelawa Bedda', 'Kahagolla', 'Magandaoya Colony', 'Gonathalawa', 'Dambagalla', 'Ellekona', 'Therela', 'Iluklanda', 'Obbegoda'] },
      { name: 'Medagama', gnDivisions: ['Pothubandana', 'Yakunnawa', 'Bendiyawa', 'Kotabowa', 'Godigamuwa', 'Senpathigama', 'Iwela', 'Senapathiya', 'Bibilamulla', 'Nannapurawa', 'Dahamgama', 'Kalugahawadiya', 'Koongolla', 'Diviyapola', 'Kohukumbura', 'Nugamura', 'Ellekoona', 'Dahagoniya', 'Monarawana', 'Mellagama', 'Thambana', 'Thimbiriya', 'Medagama', 'Elhena', 'Pitadeniya', 'Kinnaraboowa', 'Ilukkumbura', 'Bakinigahawela', 'Pubbara', 'Polgahapitiya', 'Kendawinna', 'Alana', 'Raththanadeniaya', 'Amunekandura', 'Keenagoda'] },
      { name: 'Siyambalanduwa', gnDivisions: ['Nape', 'Buddama', 'Waragama', 'Kotagoda', 'Weragoda', 'Newgala', 'Govindupura', 'Pallewela', 'Ambagahapitiya', 'Meeyagala', 'Barawaya', 'Kooragammana', 'Kalugollayaya', 'Samanala Bedda', 'Muthukandiya', 'Yakkandurawa', 'Galamuna', 'Helamulla', 'Pallegama', 'Maha Kalugolla', 'Karambagoda', 'Ruhunu Danawwa', 'Sri Wijithapura', 'Siyambalanduwa', 'Manabarana', 'Madugama', 'Kivuleyaya', 'Kodayana', 'Nugagaha Kivula', 'Kotiyagoda', 'Indigasella', 'Dombagahawela', 'Liyangolla', 'Beraliyapola', 'Kimbulawela', 'Pahatha Arawa', 'Ethimale', 'Guruhela', 'Gemunupura', 'Parakumpura', 'Siripura', 'Thissapura', 'Ethimale Colony', 'Minipura', 'Vilaoya', 'Wattegama', 'Wijayapura', 'Kotiyagala'] },
      { name: 'Moneragala', gnDivisions: ['Tenwatta', 'Guruhela', 'Batugammana', 'Debeddekivla', 'Weliyaya', 'Rathnapitiya', 'Nakkala', 'Hidikiwla', 'Hulandawa', 'Magandanamulla', 'Monaragala', 'Aliyawatta', 'Kolonvinna', 'Bohitiya', 'Kawdawa', 'Hulandawa Left', 'Viharamulla', 'Muppane', 'Maduruketiya', 'Kumbukkana', 'Horombuwa', 'Hulandawa South', 'Marawa', 'Veheragala', 'Thenagallanda', 'Kahambana'] },
      { name: 'Badalkumbura', gnDivisions: ['Gadavila', 'Karandagama', 'Ella', 'Pallegama', 'Thalawagama', 'Mailagasthenna', 'Karavila', 'Madamagama', 'Wekumbura', 'Maiyokka Watta', 'Waradola', 'Ankada', 'Kotamuduna', 'Alupotha', 'Wasipaha', 'Badalkumbura', 'Maligathenna', 'Pussellawa', 'Madukotan Arawa', 'Yakurawa', 'Therappahuwa', 'Punsisigama', 'Madugahapattiya', 'Kalagahakivula', 'Madugasmulla', 'Ranugalla', 'Ethpattiya', 'Miyanakandura', 'Dewathura', 'Naranwatta', 'Athala', 'Ettalamulla', 'Muthukeliyawa', 'Meegahayaya', 'Bogahapelessa', 'Dambagahawela', 'Hingurukaduwa', 'Keliwessa', 'Moratuwagama', 'Lunugala Colony', 'Katugahagalge'] },
      { name: 'Wellawaya', gnDivisions: ['Kurugama', 'Randeniya', 'Siyambalagunaya', 'Sudupanawela', 'Kotikanbokka', 'Gallbokka', 'Dimbulamure', 'Wellawaya', 'Yalabowa', 'Nugayaya', 'Warunagama', 'Anapallama', 'Pubuduwewa', 'Neluwagala', 'Buduruwagala', 'Andawelayaya', 'Siripuragama', 'Veherayaya Colony', 'Veherayaya', 'Randenigodayaya', 'Handapanagala', 'Maha Aragama', 'Thelulla Colony', 'Ethiliwewa', 'Thelulla', 'Balaharuwa', 'Debara Ara', 'Kithulkote', 'Uva Kudaoya'] },
      { name: 'Buttala', gnDivisions: ['Uda Arawa', 'Horabokka', 'Unawatuna', 'Yudaganawa', 'Dikyaya', 'Udagama', 'Mahagodayaya', 'Gaminipura', 'Okkampitiya', 'Galtemmandiya', 'Ulugala', 'Maligavila', 'Minipuragama', 'Buruthagolla', 'Pahalagama', 'Konketiya', 'Medagama', 'Pettagamwela', 'Puhulkotuwa', 'Veheragala', 'Pelwatta', 'Mahasenpura', 'Kumaragama', 'Kukurampola', 'Kumarapura', 'Yatiyallathota', 'Waguruwela', 'Gonagan Ara', 'Rahathangama'] },
      { name: 'Katharagama', gnDivisions: ['Sella Kataragama', 'Kataragama', 'Detagamuwa', 'Kandasurindugama', 'Karavile'] },
      { name: 'Thanamalvila', gnDivisions: ['Kandiyapitawewa', 'Kotaweheramankada', 'Aluthwewa', 'Hambegamuwa', 'Hambegamuwa Colony', 'Kahakurullan Pelessa', 'Mahawewa', 'Suriya Ara', 'Usgala', 'Nikawewa', 'Bodagama', 'Kivul Ara', 'Sittarama', 'Sienukkuwa'] },
      { name: 'Sevanagala', gnDivisions: ['Katupilagama', 'Habaraluwewa', 'Samagipura', 'Weliara', 'Punchiwewa', 'Kiriibbanwewa', 'Sevanagala', 'Muthuminigama', 'Bahirawa', 'Indikolapelessa', 'Habarugala', 'Nugegalayaya', 'Mahagama', 'Habarattawela'] },
    ]
  },
  'Ratnapura': {
    province: 'Sabaragamuwa',
    divisionalSecretariats: [
      { name: 'Eheliyagoda', gnDivisions: ['Divurumpitiya', 'Hewainna', 'Kalatuwawa East', 'Getahetta', 'Walavita', 'Meennana', 'Bopetta Didda', 'Thoranakada', 'Ganegoda', 'Iddamalgoda', 'Huladduwa', 'Kalatuwawa West', 'Uduwaka', 'Napawala', 'Pelpitiya', 'Udumatta', 'Vilegoda', 'Vilegoda East', 'Eheliyagoda Watta', 'Asgangula North', 'Kendagamuwa Ihalagama', 'Moragala', 'Bulugahapitiya', 'Yakudagoda', 'Kandangamuwa', 'Asgangula South', 'Mahara', 'Mahingoda', 'Nakandala', 'Viyalagoda', 'Kendangamuwa Pahalagama', 'Paligala', 'Miyanakolathenna', 'Mitipola', 'Mapota', 'Karandana North', 'Kiriporuwa', 'Nedurana', 'Erepola', 'Sirisamanpura', 'Nugadanda', 'Karandana West', 'Karandana South', 'Hindurangala'] },
      { name: 'Kuruvita', gnDivisions: ['Amuhenkanda', 'Pathberiya West', 'Pathberiya', 'Meneripitiya', 'Parakaduwa', 'Bodhimaluwa', 'Thalavitiya', 'Pohorabawa', 'Pussella', 'Devipahala', 'Endiriyanwala', 'Erathna', 'Adavikanda', 'Lassakanda', 'Sudugala', 'Ekneligoda North', 'Keeragala', 'Kandangoda', 'Millavitiya', 'Miyanadeniya', 'Ovitigama', 'Theppanawa', 'Theppanawa Ihalagama', 'Pahala Kuruvita', 'Kandangoda South', 'Wathuyaya', 'Udakada', 'Ekneligoda', 'Delgamuwa', 'Kuruvita', 'Walandura', 'Nadukaradeniya', 'Kahengama', 'Pathagama', 'Theppanawa Pahalagama', 'Kithulpe', 'Kahengama West', 'Kosgoda', 'Galukagama'] },
      { name: 'Kiriella', gnDivisions: ['Ellawala', 'Deheragoda', 'Kanuggalla', 'Ellawala Pahalagama', 'Mudunkotuwa', 'Akurana', 'Kiriella', 'Handukanda', 'Epitawala', 'Munasinghepura', 'Yatipawwa', 'Ellagawa', 'Idangoda', 'Matuwagala', 'Dodampe West', 'Dodampe', 'Holeepitiya'] },
      { name: 'Ratnapura', gnDivisions: ['Gileemale North', 'Ketawala', 'Guruluwana', 'Siripagama', 'Sri Palabaddala', 'Mapalana', 'Kudawa', 'Dehenakanda', 'Bambarabotuwa', 'Alupola', 'Balakotunna', 'Hapugasthenna', 'Rathgama', 'Gileemale South', 'Pagoda', 'Embuldeniya', 'Malangama', 'Amuthagoda', 'Kahangama', 'Ketaliyampalla', 'New Town', 'Ellegedara', 'Malwala', 'Durekkanda', 'Galabada', 'Gallella', 'Amunutenna', 'Kempanawatta', 'Gurubevilagama', 'Batewela', 'Hettikanda', 'Banagoda', 'Heenberenduwa', 'Egoda Malwala', 'Meehitiya', 'Kospelavinna', 'Weralupa', 'Dewalaya Gawa', 'Muwagama', 'Ratnapura Town West', 'Ratnapura Town North', 'Mihindugama', 'Mahawala', 'Godigamuwa', 'Ratnapura Town', 'Mudduwa East', 'Samagipura', 'Ethoya', 'Mudduwa', 'Batugedara', 'Angammana', 'Thiriwanketiya', 'Kolandagala', 'Kahangama', 'Kospelavinna'] },
      { name: 'Imbulpe', gnDivisions: ['Rawanakanda', 'Gallenakanda', 'Kattadikanda', 'Waleboda North', 'Bellankanda', 'Bolthumbe', 'Pinnawala', 'Udagama', 'Madhdhegama', 'Pidaligannawela', 'Ihalagalagama', 'Wiharawela', 'Kuburutheniwala', 'Belihuloya', 'Yakdehiwala', 'Muththettuwegama', 'Puwakgahawela', 'Budunwela', 'Halpe', 'Niththamaluwa', 'Kumbalgama', 'Kinchigune', 'Karagasthalawa', 'Seelogama', 'Imbulpe', 'Passaramulla', 'Alakolaella', 'Atawakwela', 'Kanathiriyanwela', 'Pallewela', 'Gurubewila', 'Pandheniya', 'Pagalowita', 'Madhdhethalawa', 'Amuwathugoda', 'Medagedaragoda', 'Aluthnuwara', 'Thotapalla', 'Ulupitiya', 'Mamalgaha', 'Welanhinna', 'Amupitiya', 'Naluwela', 'Wegapitiya', 'Morahela', 'Oluganthota', 'Rathmalawinna', 'Karadiyamulla', 'Hatharabage', 'Thunkinda'] },
      { name: 'Balangoda', gnDivisions: ['Egoda Waleboda', 'Welekumbura', 'Wijinathkumbura', 'Bulathgama', 'Thumbagoda', 'Kirindigala', 'Yahalewela', 'Batugammana', 'Aldora', 'Watawala', 'Mulgama', 'Rajawaka', 'Bowatta', 'Wikiliya', 'Thotupalathenna', 'Kirimetithenna', 'Dehigastalawa', 'Balangoda Town', 'Balangoda', 'Jahinkanda', 'Meddekanda', 'Ellewatta', 'Polwathugoda', 'Durakanda', 'Rassagala', 'Ampitiyawatta', 'Massenna', 'Pettigala', 'Pallekanda', 'Ellepola', 'Thalangama', 'Kumara Gama', 'Damahana', 'Godakumbura', 'Imbulamure', 'Mahawalathenna', 'Theladiriya', 'Mawela', 'Welange', 'Gawaranhene', 'Horaketiya'] },
      { name: 'Kalthota', gnDivisions: ['Kalthota', 'Medabedda', 'Thanjanthenna', 'Neluyaya', 'Kuragala', 'Diyavinna', 'Welipathayaya', 'Molamure', 'Kalupedigama', 'Kongahamankada'] },
      { name: 'Opanayaka', gnDivisions: ['Polwattahena', 'Metihakwala', 'Malmeekanda', 'Meegahawela', 'Kendaketiya', 'Pelendakanda', 'Madola', 'Udawela', 'Opanayaka', 'Hunuwala North', 'Hallinna', 'Hunuwala South', 'Dandeniya', 'Wallaketiya', 'Akarella', 'Hattella', 'Hattella Egoda', 'Batadura', 'Liyanagoda', 'Galkanda'] },
      { name: 'Pelmadulla', gnDivisions: ['Gonakumbura', 'Bopetta', 'Berenduwa', 'Narangoda', 'Kuttapitiya', 'Ganegama', 'Godagama', 'Dombagaswinna', 'Sannasgama', 'Dippitigala', 'Lellopitiya', 'Welimaluwa', 'Gallinna', 'Maudella', 'Marapana', 'Pahala Hakamuwa', 'Ihala Hakamuwa', 'Pottakanda', 'Niralgama', 'Alupotha', 'Devalegama', 'Halpawala', 'Kapuhenthota', 'Panavenna', 'Borala', 'Morathota', 'Kattange', 'Poranuwa'] },
      { name: 'Elapatha', gnDivisions: ['Kahawatta', 'Dambuluwana', 'Raddella', 'Haldola', 'Karangoda', 'Samangama', 'Kehelovitigama', 'Weragama', 'Dellabada', 'Elapatha', 'Pallegedara', 'Kotamulla', 'Amuwala', 'Gangulvitiya', 'Niriella', 'Palawela', 'Batakada', 'Digana', 'Magurugoda', 'Hangamuwa'] },
      { name: 'Ayagama', gnDivisions: ['Dumbara', 'Katepola', 'Dethabada Kanda', 'Madabaddara', 'Pahala Galthura', 'Galathura', 'Sinhalagoda', 'Gangodakanda', 'Dumbara Manana', 'Gavaragiriya', 'Pitakanda', 'Pallekada', 'Ellahena', 'Vithanagama', 'Ayagama', 'Udugala North', 'Kolambewa', 'Udugala', 'Paragala', 'Pimbura', 'Nikagoda'] },
      { name: 'Kalawana', gnDivisions: ['Kodippilikanda', 'Jathuwangoda', 'Meepagama', 'Kukulegama North', 'Samanpura', 'Kalawana West', 'Thapassarakanda', 'Koswatta', 'Kukulegama South', 'Pitigalakanda', 'Wewagama', 'Davugalagama', 'Wembiyagoda', 'Kalawana East', 'Wewelkandura', 'Hangarangala', 'Wathurawa', 'Delgoda East', 'Delgoda West', 'Weddagala West', 'Weddagala East', 'Kudumiriya', 'Thanabela', 'Rambuka', 'Dolekanda', 'Kathlana', 'Gangalagamuwa', 'Panapola', 'Kudawa', 'Hapugoda', 'Pothupitiya North', 'Pothupitiya South', 'Ilumbakanda'] },
      { name: 'Nivithigala', gnDivisions: ['Pathakada', 'Noragalla', 'Dombagammana', 'Erabadda', 'Kiribathgala', 'Wanniyawatta', 'Watapotha', 'Thuththiripitiya', 'Nivithigala', 'Yakdehiwaththa', 'Wathupitiya', 'Horangala', 'Pahala Karavita', 'Uda Karavita', 'Pinkanda', 'Halkandaliya', 'Sidurupitiya', 'Doloswala', 'Colombagama', 'Doloswalakanda', 'Pebotuwa', 'Horanekarakanda', 'Delwala', 'Panahetagala'] },
      { name: 'Kahawatta', gnDivisions: ['Yainna', 'Nugawela West', 'Nugawela East', 'Weladura', 'Bungiriya', 'Uwa Hawpe', 'Yatagare', 'Madalagama Colony', 'Panapitiya North', 'Nambuluwa', 'Atakalanpanna', 'Pahamunupanna', 'Kalalella', 'Panapitiya South', 'Gabbela', 'Endana', 'Madalagama', 'Miyanawita West', 'Miyanavita East', 'Kiranodagama', 'Pannila'] },
      { name: 'Godakawela', gnDivisions: ['Kotakethana', 'Dimbulwala', 'Hapurudeniya', 'Panawala', 'Buluwana', 'Makandura', 'Ematiyagoda', 'Ridivita', 'Maragala', 'Hiramadagama', 'Madampe North', 'Kavuduwawa', 'Madampe South', 'Horamula', 'Weralugahamula', 'Alpitiya', 'Galahitiya', 'Kompitiya', 'Malwatta', 'Werahera West', 'Werahera East', 'Godakawela', 'Warayaya', 'Niyangama', 'Bambaragastenna', 'Balavinna North', 'Balavinna West', 'Kapuhenthenna', 'Mawathalanda', 'Meddegama', 'Masimbula', 'Rakwana Town', 'Kottala', 'Rakwana South', 'Rakwana North', 'Yahalawela', 'Bibilegama West', 'Bibilegama East', 'Thambagamuwa West', 'Dambavinna', 'Balavinna East', 'Thambagamuwa East', 'Mahagama West', 'Mahagama East'] },
      { name: 'Weligepola', gnDivisions: ['Paragahamaditta', 'Illukkumbura', 'Panana', 'Galgodagama', 'Kongastenna', 'Bopitigoda', 'Gangodagama', 'Medaganoya', 'Udaranwala', 'Weligepola', 'Udagangoda', 'Belimaliyadda', 'Handagiriya', 'Handagirigoda', 'Palugahawela', 'Urawala', 'Kottimbulwala', 'Thalagaskanda', 'Ranwala', 'Ammaduwa', 'Elamalpe', 'Thennahena', 'Kalatuwakanda', 'Badullegama', 'Hatangala', 'Bambaragala', 'Pussathota', 'Madawalalanda', 'Galpaya', 'Muttettupola'] },
      { name: 'Embilipitiya', gnDivisions: ['Pallebedda', 'Thittawelpotha', 'Panahaduwa', 'Udawalawa', 'Thimbolketiya', 'Kolambage Ara', 'Sankhapala', 'Miriswelpotha', 'Adaluwa', 'Maduwanwela', 'Udawalawa Track 2', 'Rathkarawwa', 'Gangeyaya', 'Ketagal Ara', 'Nindagam Pelessa', 'Ranchamadama', 'Panamura', 'Konkatuwa', 'Yodhagama', 'Modarawana', 'Sudugala', 'Walalgoda', 'Jadura', 'Diyapota', 'Mulendiyawala', 'Thorakolayaya', 'Kumbugoda Ara', 'Hingura', 'Halmillaketiya', 'Thunkama', 'Hagala', 'Kuttigala', 'Julangete', 'Padalangala'] },
      { name: 'Kolonna', gnDivisions: ['Buluthota', 'Ranhotikanda', 'Yakmaditta', 'Helaudakanda', 'Heneggegoda', 'Kumburugamuwa', 'Dambemada', 'Welewathugoda', 'Ereporuwa', 'Wijeriya', 'Poddana', 'Ittakanda', 'Buthkanda', 'Kolonna', 'Maduwanwela Peranigama', 'Nandanagama', 'Ambagahayaya', 'Kella', 'Boraluwageaina', 'Ullinduwawa', 'Pupulaketiya', 'Habbeliara', 'Walakada', 'Koppakanda', 'Dapane', 'Dorapane', 'Morawadiya', 'Omalpe', 'Kempane'] },
    ]
  },
  'Kegalle': {
    province: 'Sabaragamuwa',
    divisionalSecretariats: [
      { name: 'Rambukkana', gnDivisions: ['Dombemada East', 'Dombemada West', 'Udanvita', 'Maligathenna', 'Alugolla', 'Gabbala North', 'Gabbala South', 'Mahagama', 'Halwatta', 'Hewadiwala', 'Nattabura', 'Kudagama North', 'Kudagama dakuna', 'Madagaladeniya', 'Walgama', 'Udagaladaniya', 'Dabulla', 'Daliwala', 'Hangawela', 'Ihala Walpola', 'Kotawella', 'Kanugolla', 'Parape North', 'Parape South', 'Kossinna', 'Kansalagamuwa', 'Heenabowa', 'Walalgoda', 'Kiriwallapitiya', 'Iriyagolla', 'Warallapatha', 'Waligamuwa', 'Thaldawa', 'Wahawa', 'Padavigampala', 'Puwakmote', 'Udugama', 'Thismalpola', 'Yatagama', 'Meeduma', 'Hurimaluwa', 'Eriyawa', 'Rambukkana City', 'Diyasunnatha', 'Madawala', 'Godagandeniya', 'Kempitiya', 'Kadigamuwa', 'Halagiriya', 'Muwapitiya', 'Beligodapitiya', 'Pinnawala', 'Daluggala', 'Mottappuliya', 'Koorempola', 'Halpitiya', 'Narambedda East', 'Narambedda West', 'Maruk wathura', 'Imbulgasdeniya', 'Ambuwangala', 'Keselwathugoda', 'Dunukewala', 'Waduwadeniya', 'Hiriwadunna', 'Bathambure', 'Koththana Watta', 'Kotagama', 'Kiriwandeniya', 'Netiyapana', 'Udugama Gondawala', 'Paththampitiya', 'Yatiwaldeniya', 'Henepola', 'Digana Kanda', 'Gangoda', 'Beddawala', 'Yodagama', 'Pitiyegama', 'Deldeniya', 'Kivulpana', 'Minwana', 'Kumbaldewela', 'Galpala', 'Kumbaloluwa', 'Kavudaulla', 'Molagoda', 'Waragoda', 'Mangalagama'] },
      { name: 'Mawanella', gnDivisions: ['Weganthale', 'Yatimahana', 'Keppitipola', 'Ihala Kotte', 'Makehelwala', 'Dunugama Maliyadda', 'Karapane', 'Kondeniya', 'Gondiwala', 'Uthuwankanda', 'Ambulugala', 'Attanagoda', 'Panagamuwa', 'Dehimaduwa', 'Habbunkaduwa', 'Mahawatta', 'Muruthawala', 'Randiwala', 'Uda Makadawara', 'Ganethenna', 'Makadawara', 'Batawala', 'Hingula', 'Owatta', 'Hinguloya', 'Rankothdiwala', 'Mawanella', 'Mawana', 'Kiringadeniya', 'Weligalla', 'Dodanthale', 'Kappagoda', 'Nankurugama', 'Kongamuwa', 'Beligammana', 'Edaduwawa', 'Idampitiya', 'Kekirigoda', 'Uyanwtta', 'Aluthnuwara', 'Molligoda', 'Mawela', 'Warakapana', 'Kahawandala', 'Mahanthegama', 'Heenatipana', 'Rukulagama', 'Daswatta', 'Lewke', 'Kumbalgama', 'Balawathgama', 'Werake', 'Embilmeewala', 'Thambavita', 'Eraminigammana', 'Ambadeniya', 'Weragoda', 'Kooragala', 'Waduwawala', 'Ginihappitiya West', 'Ginihappitiya East', 'Ambaruppa', 'Madulbowa', 'Ambalawa', 'Balathgamuwa', 'Kehelpannala East', 'Wadiyathenna', 'Hemmathagama', 'Dumbuluwawa', 'Kehelpannala west', 'Palliporuwa'] },
      { name: 'Aranayaka', gnDivisions: ['Deewala Udagama', 'Wakirigala', 'Epalawa Watta', 'Uduwewala', 'Kande Watta', 'Gal Athara', 'Gammannagoda', 'Katugaha', 'Ussapitiya', 'Waharakgoda', 'Ruwandeniya', 'Attapitiya', 'Davanagala', 'Kariyagama', 'Godigamuwa', 'Narangammana', 'Lambutuwa', 'Wattegedara', 'Asmadala', 'Kandamulla', 'Kumarapura', 'Debathgama Udabage', 'Debathgama Pallebage', 'Hathgampola', 'Moragammana', 'Gevilipitiya Town', 'Gevilipitiya Gama', 'Pehinipaddera', 'Nikapitiya', 'Thalgamuwa', 'Dippitiya', 'Habalakawa', 'Keerapona', 'Vilpola', 'Galbokka', 'Elangipitiya', 'Kalugala', 'Kehelwatta', 'Dampelgoda', 'Narangala', 'Gataberi Kanda', 'Pannala', 'Duldeniya', 'Thalgaspitiya Muslimgama', 'Thalgaspitiya', 'Thelleke', 'Hakurugammana', 'Aranayaka', 'Udagama', 'Ambalakanda', 'Ganthne Udagama', 'Ganthne Medagama', 'Jambugasmada', 'Podape', 'Deiyanwala gama', 'Arama', 'Rahala', 'Randiligama', 'Yodhagama', 'Selawa East', 'Selawa West'] },
      { name: 'Kegalle', gnDivisions: ['Siyabalabitiya', 'Pussella', 'Dimbulgamuwa', 'Kolongalla', 'Diyagama', 'Kalugalla', 'Puwakdeniya', 'Meepitiya', 'Olagankanda', 'Wewaladeniya', 'Ranwala', 'Paranagampala', 'Uraulla', 'Ambanpitiya', 'Beragala', 'Kegalle Town', 'Golahela', 'Karandupana', 'Uda Karandupana', 'Nilmalgoda', 'Paragammana', 'Waldeniya', 'Dik- ella', 'Buluruppa', 'Ekiriyagala', 'Deewela Madagama', 'Deewela Pallegama', 'Ewunugalla', 'Dikkohupitiya', 'Kavudugama', 'Makoora', 'Bulugahadeniya', 'Thalewala', 'Hettimulla', 'Minuwangamuwa', 'Udumagama', 'Wadupola', 'Wathura', 'Meedeniya South', 'Meedeniya North', 'Malavita', 'Godigamuwa', 'Hapuwita Pallegama', 'Alapalawala', 'Neelapalagammana', 'Eragama', 'Athurupana', 'Rotuwa', 'Hungampola', 'Gurullawala', 'Moradana', 'Mabopitiya', 'Higgoda', 'Bossalla', 'Ganthuna Pallegama North', 'Bogala', 'Thiyambarahena', 'Undugoda', 'Belihulwana', 'Ganthuna Pallegama South', 'Pallewela'] },
      { name: 'Galigamuwa', gnDivisions: ['Helamada', 'Godapola', 'Batuwatta', 'Makuddala', 'Weragoda', 'Jeewana', 'Dewalegama', 'Walagama', 'Kandegedera', 'Edurapotha West', 'Panakawa', 'Edurapotha East', 'Nawagamuwa', 'Hathnagoda', 'Peherambe', 'Palapoluwa', 'Yattogoda', 'Ballapana Pathabage', 'Kobbewala', 'Galigamuwa', 'Ballapana Udabage', 'Maifield', 'Asideniya', 'Dembatanpitiya', 'Bisowela', 'Imbulgala', 'Atugoda', 'Ranapana', 'Bambaragama', 'Naberiyawa', 'Narangoda', 'Alawala', 'Holombuwa', 'Boyagoda', 'Arandara', 'Kiridana', 'Kinigama', 'Damunupola', 'Lahupana', 'Pothukoladeniya', 'Pindeniya', 'Udugama', 'Nadeniya', 'Atala', 'Hapudeniya', 'Kurunegoda', 'Ruggahathenna', 'Ampe', 'Hathnapitiya', 'Karagala', 'Aruggammana'] },
      { name: 'Warakapola', gnDivisions: ['Waddeniya', 'Kalugala', 'Weniwellakaduwa', 'Kodapaluwa', 'Opatha', 'Paspolakanda', 'Thulhiriya', 'Parakramagama', 'Nangalla', 'Ragalkanda', 'Heliyagoda', 'Metiyagane', 'Thalgama', 'Egalla', 'Kumbalgama', 'Akwatta', 'Pinnagoda Kanda', 'Gasnawa', 'Mangedara', 'Ambepussa', 'Warakapola', 'Nape', 'Morawaka', 'Mampita', 'Nelumdeniya', 'Othnapitiya', 'Boorunnawa', 'Elipangamuwa', 'Delgamuwa', 'Thumbaliyadda', 'Ganithapura', 'Kukulpane', 'Thalliyadda', 'Dorawaka Pallebage', 'Yaddehimulla', 'Kohombadeniya', 'Ihala Lenagala', 'Dedigama', 'Pitadeniya', 'Maha Pallegama', 'Kinivita', 'Hapugoda', 'Dorawaka Udabage', 'Weragoda', 'Palamure', 'Bopitiya', 'Algama', 'Madurupitiya', 'Uduwaka', 'Hallawa', 'Ebidigala', 'Alpitiya', 'Kivuldeniya', 'Kudapallegama', 'Thambadiya', 'Elamaldeniya', 'Malmaduwa', 'Polgampola', 'Weragala', 'Pallepelpita', 'Pahala Lenagala', 'Welhella', 'Dummaladeniya', 'Algama Ihalagama', 'Kandegama', 'Ethnawala', 'Niwatuwa'] },
      { name: 'Ruwanwella', gnDivisions: ['Dunumala', 'Galapitamada', 'Walgampatha', 'Kadigamuwa', 'Mahakanda', 'Lenagala', 'Lewangama North', 'Lewangama South', 'Morathota', 'Waharaka', 'Daluwalana', 'Wahakula', 'Dannoruwa', 'Nivunhella', 'Imbulana', 'Siyambalawala', 'Pethangoda', 'Kannattota', 'Gonaraba', 'Doranuwa', 'Bopetta', 'Morawatta', 'Mahalla', 'Gonagala North', 'Indurana', 'Gonagala West', 'Mapitigama', 'Moraliya', 'Ruwanwella', 'Wendala', 'Mahadeniya', 'Uda Kanugala', 'Palle Kanugala', 'Medagoda'] },
      { name: 'Bulathkohupitiya', gnDivisions: ['Kanangamuwa', 'Gettiyamulla', 'Higgoda', 'Pushpane', 'Kabagamuwa', 'Alawathura', 'Ambuwakka', 'Bulathkohupitiya', 'Rangalla', 'Knews Mior Ihala', 'Uduwa', 'Dedugala', 'Pelempitiya', 'Neluwakkana', 'Udapotha', 'Kendawa', 'Narangala', 'Urumeewala', 'Poonahela', 'Panapitiya', 'Ampagala', 'Thelkumuduwala', 'Kiriporuwa', 'Ambamalla'] },
      { name: 'Yatiyanthota', gnDivisions: ['Maththamagoda', 'Galpatha', 'Kabulumulla', 'Pahala Garagoda', 'Ihala Garagoda', 'Yatiyanthota', 'Mahavila', 'Parussella', 'Jayavindagama', 'Welihelathenna', 'Malalpola', 'Dombepola', 'Amanawala', 'Berannawa', 'Seeforth', 'Mahabage', 'Dunukedeniya', 'Malwatta', 'Kirikohuthenna', 'Neluwathukanda', 'Polpitiya', 'Weeragalla', 'Nawata', 'Meegasthenna', 'Pelellegama', 'Hakbellawaka', 'Ganepalla', 'Theligama', 'Gonagamuwa', 'Kithulgala North', 'Kalukohuthenna', 'Kithulgala South'] },
      { name: 'Dehiovita', gnDivisions: ['Kurupetta', 'Daigala', 'Eluwana', 'Magammana', 'Kanangama', 'Walpola', 'Boralankada', 'Dikella', 'Kahanawita', 'Dehiovita', 'Atulugamwela', 'Atulugama', 'Kelegama', 'Napawala', 'Uduwila', 'Epalapitiya', 'Lower Thalduwa', 'Upper Thalduwa', 'Debegama', 'Thimbiripola', 'Algoda', 'Hinguralakanda( East)', 'Batangala', 'Viharakanda', 'Galabalana Kanda', 'Maniyangama', 'Madola', 'Welangalla', 'Bomaluwa', 'Rangegama', 'Panawala', 'Hinguralakanda (West)', 'Pookunuwala', 'Godagampala', 'Ambalanpitiya', 'Madagammana', 'Pannila', 'Imbulpitiya', 'Elawulla'] },
      { name: 'Deraniyagala', gnDivisions: ['Ballehela', 'Behenella', 'Nilwala', 'Dodawatta', 'Basnagala', 'Keerihena', 'Udabage', 'Wattegedera', 'Deraniyagala', 'Lassegama', 'Anhettigama', 'Panakoora', 'Pandaha', 'Polgaswatta', 'Maliboda', 'Poddenikanda', 'Nakkavita', 'Miyanawita', 'Deraniyagala South', 'Rasnakkanda', 'Udapola', 'Demada', 'Kosgahakanda', 'Yatiwala', 'Magala', 'Dikellakanda'] },
    ]
  },
};

// Utility functions
const getDistrictNames = () => {
  return Object.keys(ADMINISTRATIVE_DIVISIONS).sort();
};

const getDivisionalSecretariats = (district) => {
  const districtData = ADMINISTRATIVE_DIVISIONS[district];
  if (!districtData) return [];
  return districtData.divisionalSecretariats.map(ds => ds.name).sort();
};

const getGNDivisions = (district, divisionalSecretariat) => {
  const districtData = ADMINISTRATIVE_DIVISIONS[district];
  if (!districtData) return [];
  
  const ds = districtData.divisionalSecretariats.find(
    d => d.name === divisionalSecretariat
  );
  
  return ds ? ds.gnDivisions.sort() : [];
};

const getProvince = (district) => {
  const districtData = ADMINISTRATIVE_DIVISIONS[district];
  return districtData ? districtData.province : null;
};

const validateLocation = (district, divisionalSecretariat, gnDivision) => {
  const districtData = ADMINISTRATIVE_DIVISIONS[district];
  if (!districtData) return false;
  
  const ds = districtData.divisionalSecretariats.find(
    d => d.name === divisionalSecretariat
  );
  
  if (!ds) return false;
  
  return ds.gnDivisions.includes(gnDivision);
};

module.exports = {
  ADMINISTRATIVE_DIVISIONS,
  getDistrictNames,
  getDivisionalSecretariats,
  getGNDivisions,
  getProvince,
  validateLocation
};
