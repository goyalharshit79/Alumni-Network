import React, { useEffect, useState } from "react";
import $ from "jquery";

function ThemeSwitch(props) {
  const [theme, setTheme] = useState(props.theme);
  const [color, setColor] = useState(() => {
    if (theme === "light") {
      return "black";
    } else if (theme === "dark") {
      return "white";
    }
  });
  const [btnTheme, setBtnTheme] = useState(() => {
    if (theme === "light") {
      return "dark";
    } else if (theme === "dark") {
      return "light";
    }
  });
  const [oppTheme, setOppTheme] = useState(() => {
    if (theme === "light") {
      return "dark";
    } else if (theme === "dark") {
      return "light";
    }
  });

  useEffect(() => {
    props.themeSetter(theme, color, btnTheme, oppTheme);
  });
  useEffect(() => {
    const el = $("#flexSwitchCheckChecked");
    theme === "dark" ? (el[0].checked = true) : (el[0].checked = false);
  });

  function bgChange() {
    setTheme(() => {
      if (theme === "light") {
        return "dark";
      } else if (theme === "dark") {
        return "light";
      }
    });
    setColor(() => {
      if (theme === "light") {
        return "white";
      } else if (theme === "dark") {
        return "black";
      }
    });
    setBtnTheme(() => {
      if (theme === "light") {
        return "light";
      } else if (theme === "dark") {
        return "dark";
      }
    });
    setOppTheme(() => {
      if (theme === "light") {
        return "light";
      } else if (theme === "dark") {
        return "dark";
      }
    });
  }

  return (
    <div className="form-switch">
      <input
        onClick={bgChange}
        className="form-check-input"
        type="checkbox"
        role="switch"
        id="flexSwitchCheckChecked"
      ></input>
    </div>
  );
}

export default ThemeSwitch;
