import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#6D15CB',
      light: '#DEDCE1',
      dark: '#4B4851'
    },
    secondary: {
      main: '#A25AEE',
      light: '#BB87F3',
      dark: '#6D15CB'
    },
    background: {
      default: '#FFFFFF',
      paper: '#DEDCE1'
    },
    text: {
      primary: '#000000'
    }
  },
  typography: {
    fontSize: 12,
    caption: {
      fontSize: 14,
      fontWeight: 400
    },
    h4: {
      fontSize: 18,
      fontWeight: 300,
      lineHeight: '140%'
    },
    h5: {
      fontSize: 16,
      fontWeight: 300
    },
    h6: {
      fontSize: 12,
      fontWeight: 'bold'
    }
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        a: {
          textDecoration: 'none',
          color: '#6D15CB'
        },
        '*::-webkit-scrollbar': {
          width: '0.4em'
        },
        '*::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px #171717'
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#6D15CB',
          outline: '1px solid #424242'
        }
      }
    },

    // TOOLBAR
    MuiToolbar: {
      gutters: {
        paddingRight: 32,
        paddingLeft: 32
      }
    },

    // DIALOG COMPONENT
    MuiDialog: {
      root: {
        '& .MuiPaper-root, & .MuiCardHeader-root': {
          background: '#F2F2F4'
        }
      },
      scrollPaper: {
        alignItems: 'flex-start'
      }
    },
    MuiDialogTitle: {
      root: {
        background: '#6D15CB',
        fontWeight: 700,
        fontSize: 18,
        lineHeight: 23,
        color: '#FFFFFF'
      }
    },
    MuiDialogContent: {
      root: {
        background: '#F2F2F4',
        padding: 8
      }
    },

    // AVATAR & ICON
    MuiAvatar: {
      root: {
        width: 32,
        height: 32
      }
    },

    // FORM & INPUT
    MuiInputBase: {
      root: {
        color: 'inherit',
        background: '#F7F7F7',
        borderRadius: 8
      }
    },
    MuiInput: {
      inputTypeSearch: {
        background: '#C4C4C4'
      },
      inputMultiline: {
        background: '#FFFFFF'
      }
    },
    MuiFormControlLabel: {
      label: {
        fontSize: 12,
        padding: '0 4px'
      }
    },

    // MuiInput: {
    //   colorSecondary: {
    //     backgroundColor: fade('#FFF', 0.9),
    //     color: '#2D2D2D',
    //     '&.MuiInput-underline:after': {
    //       borderBottomColor: '#E849BD'
    //     },
    //     '& .MuiInputBase-input': {
    //       marginLeft: 4
    //     }
    //   }
    // },
    // MuiFormLabel: {
    //   colorSecondary: {
    //     zIndex: 1,
    //     marginLeft: 4,
    //     color: fade('#000', 0.7),
    //     '&.Mui-focused': {
    //       marginLeft: 0,
    //       color: '#E849BD'
    //     }
    //   }
    // },
    // MuiSwitch: {
    //   colorPrimary: {
    //     '&&.Mui-checked': {
    //       color: '#6D15CB'
    //     }
    //   },
    //   colorSecondary: {
    //     '&&.Mui-checked': {
    //       color: '#171717'
    //     }
    //   }
    // },

    // BUTTON
    MuiButton: {
      root: {
        textTransform: 'capitalize'
      },
      sizeSmall: {
        marginLeft: 4,
        marginRight: 4,
        padding: 4,
        fontSize: 10,
        textTransform: 'capitalize'
      },
      sizeLarge: {
        borderRadius: 8,
        marginBottom: 16
      },
      containedPrimary: {
        backgroundColor: '#6D15CB'
      },
      containedSecondary: {
        backgroundColor: '#B1AEB7'
      }
    },

    // MuiChip: {
    //   colorPrimary: {
    //     backgroundColor: '#6D15CB'
    //   },
    //   colorSecondary: {
    //     backgroundColor: '#171717'
    //   }
    // },
    // MuiAccordion: {
    //   root: {
    //     background: 'transparent',
    //     border: 0,
    //     color: '#E0E0E0'
    //   }
    // },

    // MuiCardHeader: {
    //   root: {
    //     borderBottom: `1px solid #171717`,
    //     padding: '8px 16px',
    //     fontSize: 14
    //   }
    // },
    // MuiTypography: {
    //   colorSecondary: {
    //     color: '#6D15CB'
    //   }
    // },

    // MENU & LIST
    MuiList: {
      root: {
        margin: '8px 0'
      }
    },
    MuiListItem: {
      root: {
        '&:nth-child(even)': {
          backgroundColor: '#EFEFEF'
        }
      }
    },
    MuiMenu: {
      paper: {
        backgroundColor: '#C4C4C4'
      }
    },
    MuiMenuItem: {
      root: {
        backgroundColor: '#C4C4C4',
        '&:nth-child(even)': {
          backgroundColor: '#C4C4C4'
        }
      }
    },

    // CARD
    MuiCardHeader: {
      root: {
        background: '#C4C4C4',
        padding: 16,
        height: 88
      }
    },
    MuiCardActions: {
      root: {
        background: '#C4C4C4',
        padding: 8
      }
    },

    MuiTab: {
      textColorPrimary: {
        '&.Mui-selected': {
          background: '#EEEEEE',
          color: '#000000'
        }
      }
    }
  }
});

export default theme;
