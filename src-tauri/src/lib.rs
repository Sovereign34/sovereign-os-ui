use std::fs::OpenOptions;
use std::io::Write;
use std::panic;
use tauri::Manager;

fn install_panic_hook() {
    let default_hook = panic::take_hook();
    panic::set_hook(Box::new(move |info| {
        let log_path = std::env::temp_dir().join("sovereign-os-crash.log");
        if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(&log_path) {
            let _ = writeln!(
                file,
                "[{}] PANIC: {}",
                chrono_now(),
                info
            );
        }
        default_hook(info);
    }));
}

fn chrono_now() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    match SystemTime::now().duration_since(UNIX_EPOCH) {
        Ok(d) => format!("{}", d.as_secs()),
        Err(_) => "unknown_time".to_string(),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    install_panic_hook();

    let log_path = std::env::temp_dir().join("sovereign-os-crash.log");
    if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(&log_path) {
        let _ = writeln!(file, "[{}] sovereign-os starting, builder init", chrono_now());
    }

    let result = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            let log_path = std::env::temp_dir().join("sovereign-os-crash.log");
            if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(&log_path) {
                let _ = writeln!(file, "[{}] setup() entered", chrono_now());
            }
            if let Some(window) = app.get_webview_window("main") {
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!());

    if let Err(e) = result {
        let log_path = std::env::temp_dir().join("sovereign-os-crash.log");
        if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(&log_path) {
            let _ = writeln!(file, "[{}] RUN ERROR: {:?}", chrono_now(), e);
        }
        panic!("error while running tauri application: {:?}", e);
    }
}
