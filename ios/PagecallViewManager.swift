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
        DispatchQueue.main.async {
            self.pagecallView?.webView.sendMessage(message: message, completionHandler: nil)
        }
    }

    @objc(dispose)
    func dispose() {
        DispatchQueue.main.async {
            self.pagecallView?.dispose()
            self.pagecallView = nil
        }
    }
}

class PagecallView: UIView, PagecallDelegate {
    func pagecallDidTerminate(_ view: Pagecall.PagecallWebView, reason: Pagecall.TerminationReason) {
        // TODO
    }

    let webView = PagecallWebView()
    private var stopListen: (() -> Void)?

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
        DispatchQueue.main.async {
            self.stopListen?()
            self.stopListen = webView.listenMessage { message in
                self.onNativeEvent?(["message": message])
            }
        }
    }

    func dispose() {
        self.stopListen?()
        self.stopListen = nil
    }

    deinit {
        dispose()
    }
}
