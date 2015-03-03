//
//  DocumentViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/2/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class DocumentViewController: UIViewController, UIWebViewDelegate {

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
    
    @IBOutlet weak var documentWebView: UIWebView! {
        didSet {
            documentWebView.delegate = self
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor.whiteColor()
        
        loadDocument()
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
