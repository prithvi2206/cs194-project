//
//  DocumentTableViewCell.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/13/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class DocumentTableViewCell: UITableViewCell {
    
    var data: PFObject? {
        didSet {
            updateUI()
        }
    }
    
    @IBOutlet weak var documentImageView: UIImageView!
    @IBOutlet weak var documentNameLabel: UILabel!
    
    private func updateUI() {
        documentNameLabel?.text = nil
        documentImageView?.image = nil
        
        if data != nil {
            if let file_extension = data!.objectForKey("extension") as? String {
                if file_extension == "pdf" {
                    if let image = UIImage(named: "pdf-icon") {
                        documentImageView?.image = image
                    }
                } else if file_extension == "doc" || file_extension == "docx" {
                    if let image = UIImage(named: "doc-icon") {
                        documentImageView?.image = image
                    }
                }
            }
            if let image = UIImage(named: "pdf-icon.png") {
                documentImageView?.image = image
            }
            if let name = data!.objectForKey("name") as? String {
                documentNameLabel?.text = name
            }
            if let version = data!.objectForKey("version") as? Int {
                documentNameLabel?.text = documentNameLabel.text! + " (ver. \(version))"
            }
        }
    }

}
