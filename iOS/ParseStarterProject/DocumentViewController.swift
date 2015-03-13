//
//  DocumentViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/2/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class DocumentViewController: UIViewController, UIWebViewDelegate, UIScrollViewDelegate {

    var data: PFObject? {
        didSet {
            loadDocument()
        }
    }
    
    private func loadDocument() {
        if data != nil {
            if let file: PFFile? = data!.objectForKey("file") as? PFFile {
                if let url = NSURL(string: file!.url) {
                    let request = NSURLRequest(URL: url)
                    documentWebView?.loadRequest(request)
                }
            }
        }
    }
    
//    @IBOutlet weak var scrollView: UIScrollView! {
//        didSet {
//            scrollView.delegate = self
//            scrollView.contentSize = super.view.frame.size
//            scrollView.minimumZoomScale = 0.03
//            scrollView.maximumZoomScale = 5.0
//            }
//    }
    
    @IBOutlet weak var documentWebView: UIWebView! {
        didSet {
            documentWebView.delegate = self
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = "Preview"
        view.backgroundColor = UIColor.whiteColor()
        documentWebView.backgroundColor = UIColor.whiteColor()
        
        loadDocument()
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}
