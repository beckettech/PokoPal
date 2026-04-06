import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        return true
    }

    // Red status bar background
    var statusBarView: UIView?
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }

    func applicationWillResignActive(_ application: UIApplication) {}

    func applicationDidEnterBackground(_ application: UIApplication) {}

    func applicationWillEnterForeground(_ application: UIApplication) {}

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Set red status bar background after window is ready
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            self.setStatusBarColor()
        }
    }

    func applicationWillTerminate(_ application: UIApplication) {}

    func setStatusBarColor() {
        guard let window = self.window,
              let frame = window.windowScene?.statusBarManager?.statusBarFrame else { return }

        // Remove old one if exists
        statusBarView?.removeFromSuperview()

        let view = UIView(frame: frame)
        view.backgroundColor = UIColor(red: 0.86, green: 0.16, blue: 0.15, alpha: 1.0) // #dc2626
        view.tag = 9999
        window.addSubview(view)
        window.bringSubviewToFront(view)
        statusBarView = view
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
