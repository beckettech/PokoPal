import UIKit
import Capacitor
import WebKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Set window background to red
        window?.backgroundColor = UIColor(red: 0.86, green: 0.16, blue: 0.15, alpha: 1.0)

        // Find and color the WKWebView after a short delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.colorWebViewRed()
        }
        return true
    }

    var statusBarView: UIView?

    func applicationWillResignActive(_ application: UIApplication) {}

    func applicationDidEnterBackground(_ application: UIApplication) {}

    func applicationWillEnterForeground(_ application: UIApplication) {}

    func applicationDidBecomeActive(_ application: UIApplication) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            self.setStatusBarColor()
            self.colorWebViewRed()
        }
    }

    func applicationWillTerminate(_ application: UIApplication) {}

    func colorWebViewRed() {
        let red = UIColor(red: 0.86, green: 0.16, blue: 0.15, alpha: 1.0)

        // Find WKWebView in the view hierarchy
        func findWebView(in view: UIView) -> WKWebView? {
            if let wv = view as? WKWebView { return wv }
            for subview in view.subviews {
                if let found = findWebView(in: subview) { return found }
            }
            return nil
        }

        guard let window = self.window,
              let webView = findWebView(in: window) else { return }

        webView.backgroundColor = red
        webView.scrollView.backgroundColor = red
        webView.isOpaque = false
    }

    func setStatusBarColor() {
        guard let window = self.window,
              let frame = window.windowScene?.statusBarManager?.statusBarFrame else { return }

        statusBarView?.removeFromSuperview()

        let view = UIView(frame: frame)
        view.backgroundColor = UIColor(red: 0.86, green: 0.16, blue: 0.15, alpha: 1.0)
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
