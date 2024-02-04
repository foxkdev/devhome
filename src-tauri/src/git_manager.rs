use tauri::{
    plugin::{Builder, TauriPlugin},
    Runtime,
};

use git2::Repository;

// the plugin custom command handlers if you choose to extend the API:

#[tauri::command]
// this will be accessible with `invoke('plugin:awesome|initialize')`.
// where `awesome` is the plugin name.
fn initialize() {
    println!("Init git manager")
}

fn open_repo(path: String) -> Result<Repository, String> {
    println!("Opening repo at {}", path);
    match Repository::open(&path) {
        Ok(repo) => {
            println!("Success");
            println!("Repo {}", repo.path().display());
            Ok(repo)
        }
        Err(e) => {
            eprintln!("Failed to open: {}", e);
            Err(format!("Failed to open: {}", e))
        }
    }
}
#[tauri::command]
fn has_repo(path: String) -> bool {
    match Repository::open(&path) {
        Ok(_) => true,
        Err(_) => false,
    }
}

#[tauri::command]
fn get_remote(path: String) -> Result<String, bool> {
    match open_repo(path) {
        Ok(repo) => match repo.find_remote("origin") {
            Ok(remote) => {
                if let Some(url) = remote.url() {
                    Ok(url.to_string())
                } else {
                    Err(true)
                }
            }
            Err(_) => Err(true),
        },
        Err(_) => Err(false),
    }
}

#[tauri::command]
fn get_branch(path: String) -> Result<String, bool> {
    match open_repo(path) {
        Ok(repo) => match repo.head() {
            Ok(head) => {
                if let Some(name) = head.shorthand() {
                    Ok(name.to_string())
                } else {
                    Err(true)
                }
            }
            Err(_) => Err(true),
        },
        Err(_) => Err(false),
    }
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("git_manager")
        .invoke_handler(tauri::generate_handler![
            initialize, has_repo, get_remote, get_branch
        ])
        .build()
}
