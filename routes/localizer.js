var Localize = require('localize');
var myLocalize;

const translate = require('google-translate-api');
var menu;
var currentLocale = "";

(function initializeTranslations() {
  myLocalize = new Localize({
    "Log In": {
      "es": "Iniciar sesión",
    },
    "Sign Up": {
      "es": "Regístrate",
    },
    "Username": {
      "es": "Nombre de usuario",
    },
    "E-Mail": {
      "es": "E-Mail"
    },
    "First Name": {
      "es": "Nombre de pila"
    },
    "Last Name": {
      "es": "Apellido"
    },
    "Password": {
      "es": "Contraseña",
    },
    "Repeat Password": {
      "es": "Repite la contraseña",
    },
    "Paswords do not match": {
      "es": "Las contraseñas no coinciden"
    },
    "Username already taken": {
      "es": "Nombre de usuario ya tomado"
    },
    "View Backups": {
      "es": "Ver copias de seguridad",
    },
    "Tables": {
      "es": "Tabla"
    },
    "Test Material": {
      "es": "Material de prueba"
    },
    "Reports": {
      "es": "Informes"
    },
    "Temporary Tables": {
      "es": "Mesas Temporales"
    },
    "Charts": {
      "es": "Gráficos"
    },
    "Months": {
      "es": "Meses"
    },
    "Test": {
      "es": "Prueba"
    },
    "Settings": {
      "es": "Ajustes",
    },
    "Logout": {
      "es": "Cerrar sesión"
    },
    "Account Settings": {
      "es": "Ajustes de usuario"
    },
    "Tables Shared With": {
      "es": "Mesas compartidas con"
    },
    "Share your tables with other users": {
      "es": "Comparte tus tablas con otros usuarios"
    },
    "Add": {
      "es": "Añadir"
    },
    "User Language": {
      "es": "Idioma del usuario"
    },
    "Select a new preferred language": {
      "es": "Seleccione un nuevo idioma preferido"
    },
    "Change": {
      "es": "Cambio"
    },
    "English": {
      "es": "Inglés"
    },
    "Spanish": {
      "es": "Español"
    }
  });
})(); // self-invoking function

function translateRaw(phrase, locale, next) {
  translate(phrase, {from: "en", to: locale, raw: true})
    .then(res => {
      next(res.text);
    })
    .catch(err => {
      console.error(err);
    });
};

function translateObjectHelper(keys, obj, next) {
  // finished translating
  if (keys.length == 0) {
    next(obj);
  }
  else {
    const key = keys.pop();
    translateRaw(obj[key], currentLocale, function(res) {
      obj[key] = res;
      translateObjectHelper(keys, obj, next);
    });
  }
}

module.exports = {
  setLocale: function(locale, next) {
    myLocalize.setLocale(locale);

    var menuItems = {
      tables: "Tables",
      testmaterial: "Test Material",
      reports: "Reports",
      temptables: "Temporary Tables",
      charts: "Charts",
      months: "Months",
      test: "Test",
      settings: "Settings",
      logout: "Logout"
    };

    // only initialize menu for locale changes
    if (currentLocale !== locale) {
      currentLocale = locale;
      translateObjectHelper(Object.keys(menuItems), menuItems, function(translations) {
        menu = {
          menu: translations
        };
        next(menu)
      });
    }
    else {
      next(menu);
    }
  },
  getText: function(value) {
    return myLocalize.translate(value);
  },
  getMenuObject: function(values) {
    return Object.assign(menu, values);
  },
  translateObject: function(obj, next) {
    const keys = Object.keys(obj);
    translateObjectHelper(keys, obj, next);
  },
  getLanguageForLocale: function(locale) {
    const langs = {
      en: "English",
      es: "Spanish"
    }
    return langs[locale];
  }
}