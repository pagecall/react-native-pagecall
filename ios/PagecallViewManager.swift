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

class PagecallView: UIView, PagecallDelegate, UIDocumentPickerDelegate {
    @objc var onNativeEvent: RCTDirectEventBlock?
    func pagecallDidLoad(_ webView: PagecallWebView) {
        self.onNativeEvent?(["type": "load"])
    }

    func pagecallDidEncounter(_ view: PagecallWebView, error: Error) {
        self.onNativeEvent?(["type": "error", "message": error.localizedDescription])
    }

    func pagecallDidTerminate(_ view: PagecallWebView, reason: TerminationReason) {
        switch reason {
        case .internal:
            self.onNativeEvent?(["type": "terminate", "reason": "internal"])
        case .other(let string):
            self.onNativeEvent?(["type": "terminate", "reason": string])
        }
    }

    func pagecallDidReceive(_ view: PagecallWebView, message: String) {
        self.onNativeEvent?(["type": "message", "message": message])
    }

    private var downloadedUrl: URL?
    func pagecall(_ view: PagecallWebView, requestDownloadFor url: URL) {
        if let root = window?.rootViewController {
            let documentPicker = UIDocumentPickerViewController(forOpeningContentTypes: [.folder])
            documentPicker.delegate = self
            self.downloadedUrl = url
            root.present(documentPicker, animated: true)
        }
    }

    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        if let selectedUrl = urls.first, let downloadedUrl = downloadedUrl {
            self.downloadedUrl = nil
            do {
                if selectedUrl.startAccessingSecurityScopedResource() {
                    try FileManager().moveItem(
                        at: downloadedUrl,
                        to: selectedUrl.appendingPathComponent(downloadedUrl.lastPathComponent)
                    )
                    selectedUrl.stopAccessingSecurityScopedResource()
                }
            } catch {
                print("[PagecallView] Failed to moveItem", error)
            }
        }
    }

    let webView = PagecallWebView()
    private var stopListen: (() -> Void)?

    @objc var uri: String = "" {
        didSet {
            guard let url = URL(string: uri) else { return }
            _ = webView.load(URLRequest(url: url))
        }
    }

    @objc var stringifiedValue: String = "{}" {
        didSet {
            var javaScriptCode = """
              if(PagecallUI) {
                  const values = JSON.parse('\(stringifiedValue)');
                  for (const key in values) {
                    PagecallUI.set(key, values[key]);
                  }
              }
            """
            webView.evaluateJavaScript(javaScriptCode) { result, error in
                if let error = error {
                    print("[PagecallView] Failed to set value", error)
                }
            }
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

    func dispose() {
        self.stopListen?()
        self.stopListen = nil
    }

    deinit {
        dispose()
    }
}
