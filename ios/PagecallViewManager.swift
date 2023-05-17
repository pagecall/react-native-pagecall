import Pagecall

@objc(PagecallViewManager)
class PagecallViewManager: RCTViewManager {
    var pagecallView: PagecallView?

    override func view() -> (PagecallView) {
        let view = PagecallView()
        self.pagecallView = view
        return view
    }

    @objc override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc(sendMessage:message:)
    func sendMessage(_ viewID: NSNumber, message: String) {
        let uiManager = bridge.module(for: RCTUIManager.self) as! RCTUIManager
        DispatchQueue.main.async {
            if let pagecallView = uiManager.view(forReactTag: viewID) as? PagecallView {
                pagecallView.webView.sendMessage(message: message, completionHandler: nil)
            }
        }
    }
}

class PagecallView: UIView, PagecallWebViewDelegate {

    let webView = PagecallWebView()
    var stopListen: (() -> Void)?

    @objc var uri: String = "" {
        didSet {
            guard let url = URL(string: uri) else { return }
            _ = webView.load(URLRequest(url: url))
        }
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        self.addSubview(webView)
        webView.delegate = self
        webView.leadingAnchor.constraint(equalTo: leadingAnchor).isActive = true
        webView.trailingAnchor.constraint(equalTo: trailingAnchor).isActive = true
        webView.topAnchor.constraint(equalTo: topAnchor).isActive = true
        webView.bottomAnchor.constraint(equalTo: bottomAnchor).isActive = true
        webView.translatesAutoresizingMaskIntoConstraints = false
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    @objc var onNativeEvent: RCTDirectEventBlock?
    func pagecallDidLoad(_ webView: PagecallWebView) {
        stopListen?()
        stopListen = webView.listenMessage { message in
            self.onNativeEvent?(["message": message])
        }
    }
    deinit {
        stopListen?()
    }
}
