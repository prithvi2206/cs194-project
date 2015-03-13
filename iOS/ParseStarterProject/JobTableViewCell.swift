//
//  JobTableViewCell.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/13/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class JobTableViewCell: UITableViewCell {

    var job: PFObject? {
        didSet {
            updateUI()
        }
    }
    
    private func updateUI() {
        self.textLabel.text = ""
        self.detailTextLabel?.text = ""
        
        if job != nil {
            if let company = job!.objectForKey("company") as? String {
                self.textLabel.text = company
            }
                
            if let title = job!.objectForKey("title") as? String {
                self.detailTextLabel?.text = title
            }
        }
    }

}
